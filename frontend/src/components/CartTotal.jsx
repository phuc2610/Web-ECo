import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ selectedItems = [] }) => {

    const {currency , delivery_fee} = useContext(ShopContext);

    // Calculate total for selected items only
    const getSelectedItemsAmount = () => {
        if (selectedItems.length === 0) return 0;
        
        let total = 0;
        selectedItems.forEach(item => {
            // Check if item has price property (from buyNowItem) or need to find from products
            if (item.price) {
                total += item.price * item.quantity;
            }
        });
        return total;
    };

    const selectedAmount = getSelectedItemsAmount();

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'Tổng tiền'} text2={'giỏ hàng'} />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Tạm tính</p>
                <p>{selectedAmount.toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr/>
            <div className='flex justify-between'>
                <p>Phí giao hàng</p>
                <p>{delivery_fee.toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Tổng tiền</b>
                <b>{selectedAmount === 0 ? 0 : (selectedAmount + delivery_fee).toLocaleString('vi-VN')}{currency}</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal