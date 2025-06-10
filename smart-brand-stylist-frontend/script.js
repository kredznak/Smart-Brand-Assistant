
document.getElementById("analyzeBtn").onclick = () => {
  const output = document.getElementById("output");
  const logo = document.getElementById("logoUpload").files[0];

  const simulatedColors = ["#E91E63", "#3F51B5", "#4CAF50"];
  const simulatedFonts = ["Poppins", "Montserrat", "Open Sans"];
  const simulatedTone = "Friendly, modern, confident";

  output.innerHTML = "<p>Analyzing brand assets...</p>";

  const reader = new FileReader();
  reader.onload = function(e) {
    const logoImg = logo ? `<img src="${e.target.result}" style='max-width:150px; margin-top:10px;' alt='Uploaded logo' />` : "";
    const colorSwatches = simulatedColors.map(color => 
      `<div style='width:30px; height:30px; background:${color}; border-radius:4px; margin-right:5px; display:inline-block;' title='${color}'></div>`
    ).join("");

    const fontList = simulatedFonts.map(font => 
      `<li style="font-family: ${font};">${font}</li>`
    ).join("");

    output.innerHTML = `
      <h3>Brand Style</h3>
      ${logoImg}
      <p><strong>Colors:</strong></p>
      <div style='margin-bottom:10px;'>${colorSwatches}</div>
      <p><strong>Fonts:</strong></p>
      <ul>${fontList}</ul>
      <p><strong>Tone:</strong> ${simulatedTone}</p>
      <h4>Brand Mood Preview</h4>
      <ul>
        <li>✔ Social Post Template</li>
        <li>✔ Flyer Design</li>
        <li>✔ Email Header</li>
        <li>✔ Poster Mockup</li>
        <li>✔ Business Card</li>
      </ul>
    `;
  };

  if (logo) {
    reader.readAsDataURL(logo);
  } else {
    reader.onload();
  }
};
