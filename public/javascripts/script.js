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
    $.ajax({
        url:'/change-product-quantity',
        data:{
            cart:cartId,
            product:ProductId,
            count:count

        },
        method:'post',
        success:(response)=>{
            if (response.status) {
            
                let quantity=$('#cquantity').html()
                console.log(response,"in scriptjs")
                count=parseInt(count)+response
                $('#cquantity').html(count)
            }
            
        }
    })

}

