function addToCart(productId)
{
    $.ajax({
        url:'/add-to-cart/'+productId,
        method:'get',
        success:(response)=>{
            alert(response)
        }
    })
}