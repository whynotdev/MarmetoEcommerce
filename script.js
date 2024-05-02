async function fetchData() {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    );
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//discount percentage
function calculateDiscountPercentage(price, comparePrice) {
  if (!comparePrice || comparePrice <= price) return 0;
  return ((comparePrice - price) / comparePrice) * 100;
}

//based on category
function generateProductCards(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const discountPercentage = calculateDiscountPercentage(
      product.price,
      product.compare_at_price
    );

    productCard.innerHTML = `
      ${
        product.badge_text
          ? `<div class="badge">${product.badge_text}</div>`
          : ""
      }
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <div class="product-details">
        <div class="title-vendor-container">
          <h3 class="product-name">${product.title.slice(0, 10)}${
      product.title.length > 10 ? "..." : ""
    }</h3>
          <h4 class="vendor">•  ${product.vendor}</h4>
        </div>
        <div class="price-container">
          <p class="price">Rs ${product.price}</p>
          <p class="price">${
            product.compare_at_price
              ? `<span style="text-decoration: line-through; color: grey;">${product.compare_at_price}.00</span>`
              : "N/A"
          } <span class="discount" style="color: red;">${discountPercentage.toFixed(
      2
    )}%</span></p>
        </div>
      </div>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

    productContainer.appendChild(productCard);
  });
}

//tab switching
function handleTabSwitching(event) {
  const target = event.target;
  if (
    !target.classList.contains("tab-btn") ||
    target.classList.contains("active")
  )
    return;

  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => tab.classList.remove("active"));
  target.classList.add("active");

  const category = target.dataset.category;
  const products = data.find(
    (categoryData) => categoryData.category_name.toLowerCase() === category
  );
  generateProductCards(products.category_products);
}

//event listener for tab buttons
document.querySelectorAll(".tab-btn").forEach((tab) => {
  tab.addEventListener("click", handleTabSwitching);
});

let data;
fetchData().then((categories) => {
  data = categories;
  generateProductCards(categories[0].category_products);
});
