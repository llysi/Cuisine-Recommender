let session;
const ingredients = Array(380).fill(0);

// Load the model once on page load
async function loadModel() {
    console.log("🔄 Loading ONNX model...");
    try {
        session = await ort.InferenceSession.create('./model/model_v2.onnx');
        console.log("✅ Model loaded successfully!");
    } catch (e) {
        console.log("❌ Failed to load model:", e);
    }
}

// Load ingredients and create checkboxes
fetch('./ingredients.json')
  .then(response => response.json())
  .then(data => {
    const wrapper = document.getElementById('wrapper');

    data.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('boxCont');
      div.innerHTML = `
        <input type="checkbox" value="${item.index}" class="checkbox">
        <label>${item.ingredient}</label>
      `;
      wrapper.appendChild(div);
    });

    const checks = [...document.querySelectorAll('.checkbox')];
    checks.forEach(check => {
      check.addEventListener('change', function() {
        ingredients[check.value] = check.checked ? 1 : 0;
      });
    });
  });


// Check if at least one checkbox is checked
function testCheckboxes() {
    return ingredients.some(value => value === 1);
}

// Predict cuisine
async function startInference() {
    if (!session) {
        alert("Model is not loaded yet!");
        return;
    }

    if (!testCheckboxes()) {
        alert("Please select at least one ingredient before predicting!");
        return;
    }

    try {
        const input = new ort.Tensor(new Float32Array(ingredients), [1, 380]);
        const feeds = { float_input: input };

        const results = await session.run(feeds);

        const labelIndex = results.label.data[0];
        const classNames = ["chinese", "indian", "japanese", "korean", "thai"];
        document.getElementById("result").innerText = 'You can enjoy ' + classNames[labelIndex] + ' cuisine today!';
        console.log("Successfully loaded ONNX model");
    } catch (e) {
        console.log("❌ Failed to inference ONNX model");
        console.error(e);
    }
}

// Start loading model on page load
loadModel();
