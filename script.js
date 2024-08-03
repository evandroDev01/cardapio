const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = []; //// iniciandor um array vazinho para capturar os itens 


// botão abrir carrinho 
cartBtn.addEventListener("click",function(){
    cartModal.style.display = 'flex';
    updateCartModal();
})

/// Fechar o menu de carrinho ao click 

cartModal.addEventListener("click",function(event){
    if(event.target == cartModal)
    {
        cartModal.style.display = "none";
    }
})

/// Fechar o menu do carriho ao apertar no Butão voltar

closeModalBtn.addEventListener("click",function()
{
    cartModal.style.display = 'none';
})


menu.addEventListener('click',function(event){
    
    let parentButton = event.target.closest('.add-to-cart-btn');

    if(parentButton)
    {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));
        addToCart(name,price)
    }

})



/// função para adicionar itens no carrinho 
function addToCart(name,price)
{
    const existingItem = cart.find(item => item.name === name)

    if(existingItem)
    {
        existingItem.quantity += 1;
        return;
    }
    else
    {
        cart.push({name,price,quantity: 1,})
    }

    updateCartModal();
    
}

/// função para atualizar o carrinho 

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let qtd = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex",'justify-between','mb-4','flex-col')
        
        cartItemElement.innerHTML = `
            <div class = 'flex items-center justify-between'>
                <div>
                    <p class = 'font-medium'>${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class = 'font-medium mt-2'>R$ ${item.price}</p>
                </div>

                <button class='remove-from-cart-btn' data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{ /// Total do valor dos itens formatador
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length; ///// quantidade de itens dentro do carrinho 

}

//// Função para remover os itens do carrinho 
cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        RemoveItens(name);
    }
}) 


function RemoveItens(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1)
    {
        const item = cart[index];

        if(item.quantity > 1)
        {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index,1);
        updateCartModal();

    }
}


//// capturando o endereço do pedido


addressInput.addEventListener('input',function(event){
    let inputValue = event.value;

    if(inputValue !== "")
    {
        addressInput.classList.remove('border-red-500');
        addressWarn.classList.add('hidden');
    }

})


/// Finalizar pedido
checkoutBtn.addEventListener("click",function(){
    
    const isOpen = checkRestaurantOpen();

    if(!isOpen)
    {
        Toastify({
            text: "OPS O RESTAURANTE FECHADO NO MOMENTO!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "rigth", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        
       return;
    }
    
    
    if(cart.length === 0)
    {

        Toastify({
            text: "Nem um Item Encontrado",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "rigth", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }
    if(addressInput.value === "")
    {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add("border-red-500");
        return;
    }

    //// Enviando o pedido para API do WhatsApp

    const cartItems = cart.map((item) => {
        return(
            `${item.name}\nQuantidade: ${item.quantity}\nPreço: R$${item.price}\n`
        )
    }).join("\n")

    const address = addressInput.value;
    const message = `${cartItems} Endereço: ${address}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = "5583991819986";


    window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, "_blank");

    cart = [];
    updateCartModal();
    cartModal.style.display = "none";
    addressInput.innerHTML = '';
})

/// verificar a hora e manipular o card horario 

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}







