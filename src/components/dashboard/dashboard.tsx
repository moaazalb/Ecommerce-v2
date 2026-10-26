"use client"
import useGetData  from "@/custom-hooks/useGetData"
import "@/styles/dashboard.css"
const Dashboard = () => {
  const { data: products } = useGetData('products');
  const { data: users } = useGetData('users');

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="revenue__box">
              <h5>Total Sales</h5>
              <span>$555</span>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="order__box">
              <h5>Orders</h5>
              <span>$555</span>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="products__box">
              <h5>Total Products</h5>
              <span>{products?.length || 0}</span>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="users__box">
              <h5>Total Users</h5>
              <span>{users?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;