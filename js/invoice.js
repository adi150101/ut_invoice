// ==============================
// CONFIG (⚠️ Jangan expose kalau production)
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
  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000)
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
  const qty = Number(item.qty) || 1
  const subtotal = price * qty

  total += subtotal

  return `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center">${qty}</td>
      <td style="text-align:right">${formatRupiah(price)}</td>
      <td style="text-align:right">${formatRupiah(subtotal)}</td>
    </tr>
  `
}).join("")

// ==============================
// DISCOUNT
// ==============================
const discountPercent = Number(data.discount) || 0
const discountAmount = total * (discountPercent / 100)
const finalTotal = total - discountAmount

// ==============================
// INVOICE NUMBER (FIX)
// ==============================
const invoiceNo = data.invoiceNo || ("INV/UTS-" + Date.now())

// ==============================
// RENDER INVOICE
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
        Invoice No: ${invoiceNo}
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
      <th style="text-align:center">Qty</th>
      <th style="text-align:right">Price</th>
      <th style="text-align:right">Amount</th>
    </tr>
    ${rows}
  </table>

  <!-- TOTAL -->
  <div class="total">
    <div>Subtotal: ${formatRupiah(total)}</div>

    ${
      discountPercent > 0
        ? `<div>Discount (${discountPercent}%): -${formatRupiah(discountAmount)}</div>`
        : ""
    }

    <div class="grand-total">
      Total: ${formatRupiah(finalTotal)}
    </div>
  </div>

  <!-- BOTTOM -->
  <div class="bottom-section">

    <div class="bottom-left">
      <p class="qris-title"><b>TRUSTED</b></p>
      <img src="assets/qris.png" class="qris-img">
    </div>

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
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: "✅ Test webhook invoice berhasil"
      })
    })

    alert("Test berhasil!")
  } catch (err) {
    console.error(err)
    alert("Webhook gagal")
  }
}

// ==============================
// KIRIM KE DISCORD (FIX HD)
// ==============================
const sendToDiscord = async () => {
  const element = document.getElementById("invoice")

  try {
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio,
      useCORS: true,
      backgroundColor: "#ffffff"
    })

    canvas.toBlob(async (blob) => {
      if (!blob) return alert("Gagal membuat gambar")

      const formData = new FormData()

      formData.append("content",
`🧾 **INVOICE UTAMA STORE**
👤 Client: ${data.client}
💰 Total: ${formatRupiah(finalTotal)}`
      )

      formData.append("file", blob, "invoice.png")

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        alert("✅ Berhasil dikirim!")
      } else {
        console.error(await res.text())
        alert("❌ Gagal kirim")
      }

    }, "image/png", 1.0)

  } catch (err) {
    console.error(err)
    alert("❌ Error kirim")
  }
}
