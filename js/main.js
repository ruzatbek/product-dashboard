document.querySelector(".jsFilter").addEventListener("click", function () {
    document.querySelector(".filter-menu").classList.toggle("active");
});

// document.querySelector(".grid").addEventListener("click", function () {
//     document.querySelector(".list").classList.remove("active");
//     document.querySelector(".grid").classList.add("active");
//     document.querySelector(".products-area-wrapper").classList.add("gridView");
//     document.querySelector(".products-area-wrapper").classList.remove("tableView");
// });

// document.querySelector(".list").addEventListener("click", function () {
//     document.querySelector(".list").classList.add("active");
//     document.querySelector(".grid").classList.remove("active");
//     document.querySelector(".products-area-wrapper").classList.remove("gridView");
//     document.querySelector(".products-area-wrapper").classList.add("tableView");
// });

var modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function (e) {
    document.documentElement.classList.toggle('light');
    modeSwitch.classList.toggle('active');
});




// SIDEBAR

const sideBar = document.querySelector(".sidebar-list");
const span = document.querySelectorAll("#sidebar-span")
const sideBarList = document.querySelectorAll(".sidebar-list-item");

sideBar.addEventListener("click", function (e) {
    const id = e.target.dataset.id;
    sideBarList.forEach((spn) => {
        spn.classList.remove("active");
        e.target.classList.add("active");
    })
    span.forEach((item) => {
        item.classList.remove("active");
    })
    const element = document.getElementById(id);
    element.classList.add("active");

})



const productBtn = document.getElementById("product-btn")
const homeBtn = document.getElementById("home-btn")
const usersBtn = document.getElementById("users-btn")

productBtn.addEventListener("click", function () {
    document.querySelector(".list").classList.remove("active");
    document.querySelector(".grid").classList.add("active");
    document.querySelector(".products-area-wrapper").classList.add("gridView");
    document.querySelector(".products-area-wrapper").classList.remove("tableView");
    document.getElementById("head-product").textContent = "Products"
})

usersBtn.addEventListener("click", function () {
    document.querySelector(".list").classList.add("active");
    document.querySelector(".grid").classList.remove("active");
    document.querySelector(".products-area-wrapper").classList.remove("gridView");
    document.querySelector(".products-area-wrapper").classList.add("tableView");
    document.getElementById("head-product").textContent = "Users"


})



const productRow = document.querySelector(".products")


// GET PRODUCT AND USERS
function fetchGet(url, callback) {
    let deleteObj;
    fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            deleteObj = data
            console.log(data);
        })
        .then(() => callback(deleteObj))
}


function renderData(arr) {
    // console.log(arr);
    arr.forEach((value) => {
        let html = `
        <div class="products-row">
        <button class="cell-more-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        <div class="product-cell image">
        <img src=${value.images[0]} alt="product">
        <span class="card-title" id=${value.id}>${value.title}</span>
        </div>
        <div class="product-cell category"><span class="cell-label">Category:</span>${value.category["name"]}</div>
        <div class="product-cell status-cell">
        <span class="cell-label">Status:</span>
        <span class="status active">Active</span>
        </div>
        <div class="product-cell price card-price"><span class="cell-label">Price:</span>$${value.price}</div>
        <button class="delete-btn" id=${value.id} style="background-color:red;color:#fff;border:none;border-radius:4px;width:100%;">Delete</button>
        </div>
        `
        //   <button style="background-color:green;color:#fff;border:none;border-radius:4px;">Update</button>

        productRow.insertAdjacentHTML("beforeend", html)
    })

}

fetchGet("https://api.escuelajs.co/api/v1/products", renderData)


productRow.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
        deleteFetch(e.target.id)
    }
    if (e.target.matches(".card-title")) {
        if (e.target.parentElement.childElementCount == 2) {

            let input = document.createElement("input")
            let inputPrice = document.createElement("input")
            let btnEdit = document.createElement("button")

            btnEdit.textContent = "Update"
            btnEdit.setAttribute("id", e.target.id)
            btnEdit.setAttribute("class", "update-btn")
            btnEdit.setAttribute("style", "background-color:green;color:#fff;border:none;padding:3px;")

            input.setAttribute("class", "card-title")
            inputPrice.setAttribute("class", "card-price")

            input.setAttribute("placeholder", "Title")
            input.setAttribute("style", "color:black")
            inputPrice.setAttribute("placeholder", "Price")

            e.target.parentElement.appendChild(input)
            e.target.parentElement.appendChild(inputPrice)
            e.target.parentElement.appendChild(btnEdit)
        }
    }
    if (e.target.matches(".update-btn")) {
        updateFetch(e.target.id, e.target.previousSibling.previousSibling.value, e.target.previousSibling.value)
    }
})



// DELETE PRODUCT AND USERS
// IZOH : delete button bosilganda APIdan kelayotgan productlarimizdan 1 tasi ochib ketadi va biz bu jarayonni console da ko'rishimiz mumkin
function deleteFetch(id) {
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            fetchGet("https://api.escuelajs.co/api/v1/products", renderData)
            window.location.reload()
        })
}


// UPDATE PRODUCT AND USERS
// IZOH : title ni click qilganimizda 2 ta input chiqadi va unga malumotlarni kiritamiz va update btn ni bosamiz va shunda bizning cardimizdagi malumotlar update bo'ladi
function updateFetch(id, value, price) {
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                title: value,
                price: price
            })


        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            fetchGet("https://api.escuelajs.co/api/v1/products", renderData)
            window.location.reload()
        })

}


const addProduct = document.getElementById("add-product")

addProduct.addEventListener("click", function () {
    fetchAddPost()
})


// POST PRODUCT AND USERS
// IZOH : add product button bosilganda bizga yangi 1 ta product qo'shib beradi va biz bu jarayonni console ko'rishimiz mumkin
function fetchAddPost(arr) {
    fetch("https://api.escuelajs.co/api/v1/products/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                title: "New Product",
                price: 10,
                description: "A description",
                categoryId: 1,
                images: ["https://placeimg.com/640/480/any"]
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            window.location.reload()
            arr.forEach((el) => {
                let html = `
                    <div class="products-row">
                    <button class="cell-more-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    <div class="product-cell image">
                    <img src=${el.images} alt="product">
                    <span class="card-title" id=${el.id}>${el.title}</span>
                    </div>
                    <div class="product-cell category"><span class="cell-label">Category:</span>${el.category["name"]}</div>
                    <div class="product-cell status-cell">
                    <span class="cell-label">Status:</span>
                    <span class="status active">Active</span>
                    </div>
                    <div class="product-cell price card-price"><span class="cell-label">Price:</span>$${value.price}</div>
                    <button class="delete-btn" id=${el.id} style="background-color:red;color:#fff;border:none;border-radius:4px;width:100%;">Delete</button>
                    </div>
                    `
                //   <button style="background-color:green;color:#fff;border:none;border-radius:4px;">Update</button>

                productRow.insertAdjacentHTML("beforebegin", html)
            })
        })
}