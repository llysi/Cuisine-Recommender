let allIngredients = []; // Store all ingredients from JSON
let selectedIngredients = {}; // Store selected ingredient indices

fetch('./ingredients.json')
  .then(response => response.json())
  .then(data => {
    allIngredients = data;
    renderIngredientList(allIngredients);

    document.getElementById('search').addEventListener('input', function() {
      const keyword = this.value.toLowerCase();
      const filtered = allIngredients.filter(item => item.ingredient.toLowerCase().includes(keyword));
      renderIngredientList(filtered);
    });
  });

function renderIngredientList(list) {
  const wrapper = document.getElementById('wrapper');
  wrapper.innerHTML = ""; // Clear old checkboxes

  list.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('boxCont');
    const checked = selectedIngredients[item.index] ? 'checked' : '';
    div.innerHTML = `
      <input type="checkbox" value="${item.index}" class="checkbox" ${checked}>
      <label>${item.ingredient}</label>
    `;
    wrapper.appendChild(div);
  });

  const checks = [...document.querySelectorAll('.checkbox')];
  checks.forEach(check => {
    check.addEventListener('change', function() {
      selectedIngredients[check.value] = check.checked ? 1 : 0;
    });
  });
  document.getElementById('clearBtn').addEventListener('click', () => {
    // Reset all selected ingredients
    selectedIngredients = {};
  
    // Reset ingredients array
    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i] = 0;
    }
  
    // Uncheck all currently visible checkboxes
    const checks = [...document.querySelectorAll('.checkbox')];
    checks.forEach(check => {
      check.checked = false;
    });
  
    console.log("✅ All checkboxes cleared!");
  });
  
}

const ingredients = Array(380).fill(0);

function testCheckboxes() {
  return Object.values(selectedIngredients).some(val => val === 1);
}

async function startInference() {
  if (!session) {
    alert("Model is not loaded yet!");
    return;
  }

  if (!testCheckboxes()) {
    alert("Please select at least one ingredient before predicting!");
    return;
  }

  // Update ingredients vector
  for (let i = 0; i < ingredients.length; i++) {
    ingredients[i] = selectedIngredients[i] || 0;
  }

  try {
    const input = new ort.Tensor(new Float32Array(ingredients), [1, 380]);
    const feeds = { float_input: input };

    const results = await session.run(feeds);

    const labelIndex = results.label.data[0];
    const classNames = ["chinese", "indian", "japanese", "korean", "thai"];
    document.getElementById("result").innerText = 'You can enjoy ' + classNames[labelIndex] + ' cuisine today!';
    console.log("ONNX model loaded successfully");
  } catch (e) {
    console.log("❌ Failed to inference ONNX model");
    console.error(e);
  }
}

// Load model on start
let session;
async function loadModel() {
  console.log("🔄 Loading ONNX model...");
  try {
    session = await ort.InferenceSession.create('./model/model_v2.onnx');
    console.log("✅ Model loaded successfully!");
  } catch (e) {
    console.log("❌ Failed to load model:", e);
  }
}
loadModel();
