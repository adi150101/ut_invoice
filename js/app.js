// ==============================
// STATE
// ==============================
let items = []

// ==============================
// FORMAT RUPIAH
// ==============================
const formatRupiah = (num) =>
  "Rp " + Number(num || 0).toLocaleString("id-ID")

// ==============================
// TAMBAH ITEM
// ==============================
function addItem() {
  const nameInput  = document.getElementById("itemName")
  const priceInput = document.getElementById("itemPrice")
  const qtyInput   = document.getElementById("itemQty")

  const name  = nameInput.value.trim()
  const price = Number(priceInput.value)
  const qty   = Number(qtyInput?.value) || 1

  // VALIDASI
  if (!name || isNaN(price) || price <= 0) {
    alert("Isi item & harga dengan benar!")
    return
  }

  if (qty <= 0) {
    alert("Qty minimal 1!")
    return
  }

  // SIMPAN DATA
  items.push({ name, price, qty })

  // RESET INPUT
  nameInput.value = ""
  priceInput.value = ""
  if (qtyInput) qtyInput.value = 1

  renderItems()
}

// ==============================
// RENDER LIST ITEM
// ==============================
function renderItems() {
  let subtotal = 0

  const rows = items.map((item, index) => {
    const price  = Number(item.price) || 0
    const qty    = Number(item.qty) || 1
    const amount = price * qty

    subtotal += amount

    return `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${qty}</td>
        <td class="text-right">${formatRupiah(price)}</td>
        <td class="text-right">${formatRupiah(amount)}</td>
        <td>
          <button onclick="removeItem(${index})">Hapus</button>
        </td>
      </tr>
    `
  }).join("")

  document.getElementById("itemList").innerHTML = rows

  // ==============================
  // DISCOUNT
  // ==============================
  const discountInput = document.getElementById("discount")
  let discountPercent = Number(discountInput?.value) || 0

  // BATAS 0 - 100
  discountPercent = Math.max(0, Math.min(100, discountPercent))
  if (discountInput) discountInput.value = discountPercent

  const discountAmount = subtotal * (discountPercent / 100)
  const finalTotal = subtotal - discountAmount

  // ==============================
  // TOTAL PREVIEW
  // ==============================
  document.getElementById("totalPreview").innerText =
    discountPercent > 0
      ? `${formatRupiah(finalTotal)} (Disc ${discountPercent}%)`
      : formatRupiah(finalTotal)
}

// ==============================
// HAPUS ITEM
// ==============================
function removeItem(index){
  items.splice(index, 1)
  renderItems()
}

// ==============================
// GENERATE INVOICE
// ==============================
function goToInvoice(){

  const discount = Number(document.getElementById("discount").value) || 0
  const client   = document.getElementById("client").value.trim()
  const creator  = document.getElementById("creator").value

  if(items.length === 0){
    alert("Tambahkan item dulu!")
    return
  }

  if(!client){
    alert("Isi nama client!")
    return
  }

  const data = {
    client,
    creator,
    items,
    discount,
    invoiceNo: "INV/UTS-" + Date.now()
  }

  localStorage.setItem("invoiceData", JSON.stringify(data))
  window.location.href = "invoice.html"
}

// ==============================
// UX BOOST
// ==============================

// Enter dari harga
document.getElementById("itemPrice")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") addItem()
})

// Enter dari qty
document.getElementById("itemQty")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") addItem()
})

// Auto update discount
document.getElementById("discount")?.addEventListener("input", renderItems)
