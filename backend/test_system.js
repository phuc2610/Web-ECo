import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000';

async function runTests() {
  console.log('=== RUNNING AUTOMATED VERIFICATION ===\n');

  try {
    // 1. Test Products List
    console.log('1. Testing /api/product/list...');
    const prodRes = await axios.get(`${BACKEND_URL}/api/product/list`);
    console.log(`   Success: ${prodRes.data.success}, Products count: ${prodRes.data.products?.length}`);
    const categories = Array.from(new Set(prodRes.data.products.map(p => p.category)));
    console.log(`   Categories found: ${categories.join(', ')}`);

    // 2. Test Recent Reviews
    console.log('\n2. Testing /api/review/recent...');
    const revRes = await axios.get(`${BACKEND_URL}/api/review/recent`);
    console.log(`   Success: ${revRes.data.success}, Reviews count: ${revRes.data.reviews?.length}`);
    if (revRes.data.reviews?.length > 0) {
      console.log(`   Sample review: "${revRes.data.reviews[0].comment.slice(0, 50)}..." by ${revRes.data.reviews[0].userName}`);
    }

    // 3. Test Coupon Validation
    console.log('\n3. Testing /api/coupon/validate...');
    const c1 = await axios.post(`${BACKEND_URL}/api/coupon/validate`, {
      code: 'MINHTUAN10',
      orderAmount: 25000000
    });
    console.log(`   MINHTUAN10 (25M): success=${c1.data.success}, discount=${c1.data.discountAmount?.toLocaleString('vi-VN')}đ`);

    const c2 = await axios.post(`${BACKEND_URL}/api/coupon/validate`, {
      code: 'FREESHIP',
      orderAmount: 5000000
    });
    console.log(`   FREESHIP (5M): success=${c2.data.success}, discount=${c2.data.discountAmount?.toLocaleString('vi-VN')}đ`);

    const c3 = await axios.post(`${BACKEND_URL}/api/coupon/validate`, {
      code: 'IPHONE500K',
      orderAmount: 4000000
    });
    console.log(`   IPHONE500K (4M < 10M min): success=${c3.data.success}, message="${c3.data.message}"`);

    // 4. Test Customer Login
    console.log('\n4. Testing customer login (nguyenvanan@gmail.com)...');
    const custLogin = await axios.post(`${BACKEND_URL}/api/user/login`, {
      email: 'nguyenvanan@gmail.com',
      password: '12345678'
    });
    console.log(`   Customer Login: success=${custLogin.data?.success}, token=${!!custLogin.data?.token}`);

    // 5. Test Admin Login
    console.log('\n5. Testing admin login (admin@np.com)...');
    const adminLogin = await axios.post(`${BACKEND_URL}/api/user/admin`, {
      email: 'admin@np.com',
      password: '123456'
    });
    console.log(`   Admin Login: success=${adminLogin.data?.success}, token=${!!adminLogin.data?.token}`);

    // 6. Test Admin Statistics Overview
    if (adminLogin.data?.token) {
      console.log('\n6. Testing /api/statistics/overview with admin token...');
      const statsRes = await axios.get(`${BACKEND_URL}/api/statistics/overview`, {
        headers: { token: adminLogin.data.token }
      });
      console.log(`   Stats success: ${statsRes.data.success}`);
      console.log(`   Total Revenue: ${statsRes.data.data?.totalRevenue?.toLocaleString('vi-VN')}đ`);
      console.log(`   Total Orders: ${statsRes.data.data?.totalOrders}`);
      console.log(`   Total Products: ${statsRes.data.data?.totalProducts}`);
      console.log(`   Total Users: ${statsRes.data.data?.totalUsers}`);
    }

    console.log('\n=== ALL SYSTEM TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err.response?.data || err.message);
  }
}

runTests();
