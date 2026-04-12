// ==============================
// CONFIG
// ==============================
const WEBHOOK_URL = "https://discord.com/api/webhooks/1492867555117764769/UjaDLatJcrYOwxYauuxXj57XUBDcwdQmxYrDdCzE-sdP4-Cqf6lBRmPU283MdA8zxhnW"

// ==============================
// ELEMENT & DATA
// ==============================
const invoiceEl = document.getElementById("invoice")
const data = JSON.parse(localStorage.getItem("invoiceData"))

// ==============================
// FORMAT RUPIAH
// ==============================
const formatRupiah = (num) =>
  "Rp " + Number(num || 0).toLocaleString("id-ID")

// ==============================
// VALIDASI DATA
// ==============================
if (!data || !Array.isArray(data.items) || data.items.length === 0) {
  invoiceEl.innerHTML = `
    <div class="invoice-wrapper">
      <h2>Data invoice kosong</h2>
      <a href="index.html">Kembali</a>
    </div>
  `
  throw new Error("Data invoice kosong")
}

// ==============================
// SIGNATURE IMAGE
// ==============================
const getSignatureImage = (creator) => {
  if (creator === "Jul") return "assets/signatures/jul.png"
  if (creator === "Ucup") return "assets/signatures/ucup.png"
  return ""
}

// ==============================
// PROSES DATA
// ==============================
let total = 0

const rows = data.items.map(item => {
  const price = Number(item.price) || 0
  total += price

  return `
    <tr>
      <td>${item.name}</td>
      <td>${formatRupiah(price)}</td>
    </tr>
  `
}).join("")

// ==============================
// RENDER INVOICE (FINAL PRO FIX)
// ==============================
invoiceEl.innerHTML = `
<div class="invoice-wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">
      <img src="assets/logo.png" class="logo-img">
    </div>

    <div class="header-text">
      <h1>INVOICE UTAMA STORE</h1>
      <p>
        Date: ${new Date().toLocaleDateString("id-ID")} <br>
        Invoice No: INV-${Date.now()}
      </p>
    </div>
  </div>

  <hr>

  <!-- INFO -->
  <div class="info">
    <div class="info-left">
      <b>Billed to:</b><br>
      ${data.client || "-"}
    </div>

    <div class="info-right">
      <b>Created:</b><br>
      ${data.creator || "-"}
    </div>
  </div>

  <!-- TABLE -->
  <table>
    <tr>
      <th>Description</th>
      <th>Amount</th>
    </tr>
    ${rows}
  </table>

  <!-- TOTAL -->
  <div class="total">
    Total: ${formatRupiah(total)}
  </div>

  <!-- BOTTOM SECTION -->
  <div class="bottom-section">

    <!-- KIRI = QRIS -->
    <div class="bottom-left">
      <p class="qris-title"><b>TRUSTED</b></p>
      <img src="assets/qris.png" class="qris-img">
    </div>

    <!-- KANAN = SIGNATURE -->
    <div class="bottom-right">
      <div class="signature-box">
        <div>Hormat Kami,</div>

        ${
          getSignatureImage(data.creator)
            ? `<img src="${getSignatureImage(data.creator)}" class="signature-img">`
            : `<div class="paraf">-</div>`
        }

        <div class="signature-name">
          (${data.creator || "-"})
        </div>
      </div>
    </div>

  </div>

</div>
`

// ==============================
// TEST WEBHOOK
// ==============================
const testWebhook = async () => {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: "✅ Test webhook invoice berhasil"
      })
    })

    alert("Test berhasil! Cek Discord")
  } catch (err) {
    console.error(err)
    alert("Webhook gagal")
  }
}

// ==============================
// KIRIM PNG KE DISCORD
// ==============================
const sendToDiscord = async () => {
  const element = document.getElementById("invoice")

  try {
    const canvas = await html2canvas(element)

    canvas.toBlob(async (blob) => {

      if (!blob) {
        alert("Gagal membuat gambar")
        return
      }

      const formData = new FormData()
      formData.append("file", blob, "invoice.png")

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        alert("✅ Invoice berhasil dikirim!")
      } else {
        alert("❌ Gagal kirim (cek console)")
      }

    })

  } catch (err) {
    console.error(err)
    alert("❌ Error kirim ke Discord")
  }
}
