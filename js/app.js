// ==============================
// STATE
// ==============================
let items = []

// ==============================
// FORMAT RUPIAH
// ==============================
const formatRupiah = (num) => {
  return "Rp " + Number(num || 0).toLocaleString("id-ID")
}

// ==============================
// TAMBAH ITEM
// ==============================
function addItem(){

  const nameInput = document.getElementById("itemName")
  const priceInput = document.getElementById("itemPrice")

  const name = nameInput.value.trim()
  const price = Number(priceInput.value)

  if(!name || price <= 0){
    alert("Isi item & harga dengan benar!")
    return
  }

  items.push({ name, price })

  // reset input
  nameInput.value = ""
  priceInput.value = ""

  renderItems()
}

// ==============================
// RENDER LIST ITEM
// ==============================
function renderItems(){

  let total = 0

  const rows = items.map((item, index) => {
    total += item.price

    return `
      <tr>
        <td>${item.name}</td>
        <td>${formatRupiah(item.price)}</td>
        <td>
          <button onclick="removeItem(${index})">Hapus</button>
        </td>
      </tr>
    `
  }).join("")

  document.getElementById("itemList").innerHTML = rows
  document.getElementById("totalPreview").innerText = formatRupiah(total)
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

  const client = document.getElementById("client").value.trim()
  const creator = document.getElementById("creator").value

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
    creator, // 🔥 tambahan creator
    items
  }

  // simpan ke localStorage
  localStorage.setItem("invoiceData", JSON.stringify(data))

  // pindah halaman
  window.location.href = "invoice.html"
}
