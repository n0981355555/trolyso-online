import { google } from 'googleapis';

// Base class for analytics providers
class AnalyticsProvider {
  constructor(name) {
    this.name = name;
  }
  async getMetrics() {
    throw new Error('getMetrics() must be implemented');
  }
}

// Google Analytics 4 Module
class GA4Provider extends AnalyticsProvider {
  constructor() {
    super('Google Analytics 4');
  }

  async getMetrics() {
    const authEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const authKey = process.env.GOOGLE_PRIVATE_KEY;
    const propertyId = process.env.GOOGLE_VIEW_ID; // GA4 Property ID

    if (!authEmail || !authKey || !propertyId) {
      console.log('⚠️ Google Analytics 4 credentials missing. Using mock data.');
      return this.getMockData();
    }

    try {
      const auth = new google.auth.JWT(
        authEmail,
        null,
        authKey.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/analytics.readonly']
      );

      const analyticsdata = google.analyticsdata({
        version: 'v1beta',
        auth
      });

      const response = await analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' }
          ],
          dimensions: [{ name: 'date' }]
        }
      });

      // Format response
      const rows = response.data.rows || [];
      const totalViews = rows.reduce((sum, row) => sum + parseInt(row.metricValues[1].value || 0), 0);
      const totalUsers = rows.reduce((sum, row) => sum + parseInt(row.metricValues[0].value || 0), 0);

      return {
        views: totalViews,
        visitors: totalUsers,
        history: rows.map(row => ({
          date: row.dimensionValues[0].value,
          views: parseInt(row.metricValues[1].value),
          users: parseInt(row.metricValues[0].value)
        }))
      };
    } catch (error) {
      console.error('❌ GA4 API Error:', error.message);
      return this.getMockData();
    }
  }

  getMockData() {
    return {
      views: 12540,
      visitors: 3820,
      history: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0].replace(/-/g, ''),
          views: Math.floor(Math.random() * 300) + 200,
          users: Math.floor(Math.random() * 100) + 50
        };
      })
    };
  }
}

// Google Search Console Module
class GSCProvider extends AnalyticsProvider {
  constructor() {
    super('Google Search Console');
  }

  async getMetrics() {
    const authEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const authKey = process.env.GOOGLE_PRIVATE_KEY;
    const siteUrl = process.env.GOOGLE_SITE_URL || 'https://trolyso.online/';

    if (!authEmail || !authKey) {
      console.log('⚠️ Google Search Console credentials missing. Using mock data.');
      return this.getMockData();
    }

    try {
      const auth = new google.auth.JWT(
        authEmail,
        null,
        authKey.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/webmasters.readonly']
      );

      const webmasters = google.webmasters({
        version: 'v3',
        auth
      });

      const response = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['query', 'page'],
          rowLimit: 10
        }
      });

      const rows = response.data.rows || [];
      return {
        topKeywords: rows.slice(0, 5).map(row => ({
          keyword: row.keys[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: (row.ctr * 100).toFixed(2) + '%',
          position: row.position.toFixed(1)
        })),
        totalClicks: rows.reduce((sum, r) => sum + r.clicks, 0),
        totalImpressions: rows.reduce((sum, r) => sum + r.impressions, 0)
      };
    } catch (error) {
      console.error('❌ GSC API Error:', error.message);
      return this.getMockData();
    }
  }

  getMockData() {
    return {
      topKeywords: [
        { keyword: 'tinh luong gross net 2026', clicks: 420, impressions: 2100, ctr: '20.0%', position: 1.2 },
        { keyword: 'cach tinh bhxh 1 lan', clicks: 350, impressions: 1800, ctr: '19.4%', position: 1.5 },
        { keyword: 'tra cuu mst ca nhan', clicks: 210, impressions: 1500, ctr: '14.0%', position: 2.1 },
        { keyword: 'lich cat dien ha noi', clicks: 180, impressions: 1200, ctr: '15.0%', position: 2.4 },
        { keyword: 'tinh thue tncn online', clicks: 120, impressions: 900, ctr: '13.3%', position: 3.0 }
      ],
      totalClicks: 1280,
      totalImpressions: 7500
    };
  }
}

// Extension Stubs for future scalability (Ads, PageSpeed, Clarity, Bing)
class GoogleAdsProvider extends AnalyticsProvider {
  constructor() { super('Google Ads'); }
  async getMetrics() { return { message: 'Google Ads module is ready for integration', status: 'stub' }; }
}

class PageSpeedProvider extends AnalyticsProvider {
  constructor() { super('PageSpeed Insights'); }
  async getMetrics() { return { message: 'PageSpeed Insights module is ready for integration', status: 'stub' }; }
}

class BingWebmasterProvider extends AnalyticsProvider {
  constructor() { super('Bing Webmaster'); }
  async getMetrics() { return { message: 'Bing Webmaster module is ready for integration', status: 'stub' }; }
}

class MicrosoftClarityProvider extends AnalyticsProvider {
  constructor() { super('Microsoft Clarity'); }
  async getMetrics() { return { message: 'Microsoft Clarity module is ready for integration', status: 'stub' }; }
}

// Unified Service Manager
class AnalyticsService {
  constructor() {
    this.providers = {
      ga4: new GA4Provider(),
      gsc: new GSCProvider(),
      googleAds: new GoogleAdsProvider(),
      pagespeed: new PageSpeedProvider(),
      bing: new BingWebmasterProvider(),
      clarity: new MicrosoftClarityProvider()
    };
  }

  async getDashboardData() {
    const ga4Data = await this.providers.ga4.getMetrics();
    const gscData = await this.providers.gsc.getMetrics();
    
    return {
      overview: {
        totalViews: ga4Data.views,
        totalVisitors: ga4Data.visitors,
        searchClicks: gscData.totalClicks,
        searchImpressions: gscData.totalImpressions
      },
      chartData: ga4Data.history,
      topKeywords: gscData.topKeywords,
      modulesStatus: {
        ga4: 'active',
        gsc: 'active',
        googleAds: 'available_for_config',
        pagespeed: 'available_for_config',
        bing: 'available_for_config',
        clarity: 'available_for_config'
      }
    };
  }
}

export default new AnalyticsService();
