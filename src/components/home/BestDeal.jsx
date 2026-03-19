import React from 'react'
import { Link } from 'react-router'
import ProductCard from '../ui/ProductCard'
import { useGetProductsQuery } from '../../service/api';

const BestDeal = () => {
  const { data, isLoading } = useGetProductsQuery({limit: 6 , skip : 0, category: "smartphones"});
  console.log(data);
  return (
    <section className=' py-120'>
        <div className='container'>
            <div className=' flex justify-between pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand'>
                <h2 className='heading'>Grab the best deal on <span>Smartphones</span></h2>
                <Link to={`/shop?category=smartphones`}>View All</Link>
            </div>
            <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
              {
                data?.products.slice(0,5).map((item)=>(
                  <ProductCard key={item.id} data={item}/>
                ))
              }
     
            
            </div>
        </div>
    </section>
  )
}

export default BestDeal