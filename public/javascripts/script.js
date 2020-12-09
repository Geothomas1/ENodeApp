function addToCart(productId) {
    $.ajax({
        url: '/add-to-cart/' + productId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)

            }
            //alert(response)
        }
    })
}

function  changeQuantity(cartId,ProductId,count)
{
    let quantity=parseInt(document.getElementById(productId).innerHTML)
    count=parseInt(count)
    $.ajax({
        url:'/change-product-quantity',
        data:{
            cart:cartId,
            product:ProductId,
            count:count,
            quantity:quantity

        },
        method:'post',
        success:(response)=>{
            if (response.removeProduct) {
                alert("Product Removed from Cart")
                location.reload()
            
                
            }else{
                document.getElementById(productId).innerHTML=quantity+count

            }
            
        }
    })

}

