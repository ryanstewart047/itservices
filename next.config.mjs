import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve('.'),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/subscribe.php',
        destination: '/api/subscribe'
      },
      {
        source: '/contact.php',
        destination: '/api/contact'
      },
      {
        source: '/process_form.php',
        destination: '/api/contact'
      },
      {
        source: '/message.php',
        destination: '/api/contact'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true
      },
      {
        source: '/ambassadors.html',
        destination: '/ambassadors',
        permanent: true
      },
      {
        source: '/blog.html',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/blogdetails.html',
        destination: '/blogdetails',
        permanent: true
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/donation.html',
        destination: '/donation',
        permanent: true
      },
      {
        source: '/event.html',
        destination: '/event',
        permanent: true
      },
      {
        source: '/event-details.html',
        destination: '/event-details',
        permanent: true
      },
      {
        source: '/faq.html',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/login.html',
        destination: '/login',
        permanent: true
      },
      {
        source: '/register.html',
        destination: '/register',
        permanent: true
      },
      {
        source: '/recover-password.html',
        destination: '/recover-password',
        permanent: true
      },
      {
        source: '/privacy-policy.html',
        destination: '/privacy-policy',
        permanent: true
      },
      {
        source: '/terms-of-service.html',
        destination: '/terms-of-service',
        permanent: true
      },
      {
        source: '/project-one.html',
        destination: '/project-one',
        permanent: true
      },
      {
        source: '/project-two.html',
        destination: '/project-two',
        permanent: true
      },
      {
        source: '/priority-one.html',
        destination: '/priority-one',
        permanent: true
      },
      {
        source: '/priority-two.html',
        destination: '/priority-two',
        permanent: true
      },
      {
        source: '/priority-three.html',
        destination: '/priority-three',
        permanent: true
      },
      {
        source: '/priority-four.html',
        destination: '/priority-four',
        permanent: true
      },
      {
        source: '/priority-five.html',
        destination: '/priority-five',
        permanent: true
      },
      {
        source: '/team.html',
        destination: '/team',
        permanent: true
      },
      {
        source: '/team-abu-details.html',
        destination: '/team-abu-details',
        permanent: true
      },
      {
        source: '/team-alimamy-details.html',
        destination: '/team-alimamy-details',
        permanent: true
      },
      {
        source: '/team-habibu-details.html',
        destination: '/team-habibu-details',
        permanent: true
      },
      {
        source: '/team-hassan-details.html',
        destination: '/team-hassan-details',
        permanent: true
      },
      {
        source: '/team-isatu-details.html',
        destination: '/team-isatu-details',
        permanent: true
      },
      {
        source: '/team-john-details.html',
        destination: '/team-john-details',
        permanent: true
      },
      {
        source: '/team-ryan-details.html',
        destination: '/team-ryan-details',
        permanent: true
      },
      {
        source: '/team-samuella-details.html',
        destination: '/team-samuella-details',
        permanent: true
      },
      {
        source: '/team-usman-details.html',
        destination: '/team-usman-details',
        permanent: true
      },
      {
        source: '/posts-by-author.html',
        destination: '/posts-by-author',
        permanent: true
      },
      {
        source: '/posts-by-category.html',
        destination: '/posts-by-category',
        permanent: true
      },
      {
        source: '/posts-by-date.html',
        destination: '/posts-by-date',
        permanent: true
      },
      {
        source: '/posts-by-tag.html',
        destination: '/posts-by-tag',
        permanent: true
      },
      {
        source: '/error-404.html',
        destination: '/404',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
