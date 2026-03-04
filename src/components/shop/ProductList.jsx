import React, { useState } from "react";
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "../../service/api";
import Loading from "../ui/Loading";
import { useSearchParams } from "react-router";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category")
  const [limit, setLimit] = useState(30)
  const [skip, setSkip] = useState(0)
  const { data, isLoading } = useGetProductsQuery({limit,skip,category});
  console.log(data);                                                                   
  return (
    <section className="py-120">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-xl text-primary">
              Showing <span className="font-bold">({limit} Items)</span>
            </h4>
          </div>
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl text-primary">
              Displaying {skip+1}-{limit} of {data?.total} Products
            </p>
            <select onChange={(e)=>setLimit(e.target.value)} className="border rounded-2xl px-4 py-2 font-semibold text-xl text-primary">
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="90">90</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="180">180</option>
              <option value="210">210</option>
   
            </select>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
            {data?.products.map((item) => (
              <ProductCard key={item.id} data={item}/>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
