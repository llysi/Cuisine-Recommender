const ingredients = Array(380).fill(0);
        
const checks = [...document.querySelectorAll('.checkbox')];

checks.forEach(check => {
    check.addEventListener('change', function() {
        // toggle the state of the ingredient
        // based on the checkbox's value (1 or 0)
        ingredients[check.value] = check.checked ? 1 : 0;
    });
});

function testCheckboxes() {
    // validate if at least one checkbox is checked
    return checks.some(check => check.checked);
}

async function startInference() {

    let atLeastOneChecked = testCheckboxes()

    if (!atLeastOneChecked) {
        alert('Please select at least one ingredient.');
        return;
    }
    try {
        // create a new session and load the model.
        console.log("Max checkbox value:", Math.max(...checks.map(c => parseInt(c.value))));
        console.log("Ingredients length:", ingredients.length);
        console.log("Sum of ingredients:", ingredients.reduce((a, b) => a + b, 0));
        
        const session = await ort.InferenceSession.create('./model/model_v2.onnx');

        const input = new ort.Tensor(new Float32Array(ingredients), [1, 380]);
        const feeds = { float_input: input };

        // feed inputs and run
        const results = await session.run(feeds);

        console.log("Output keys:", Object.keys(results));
        console.log("Results object:", results);


        // read from results
        const labelIndex = results.label.data[0];
        const classNames = ["chinese", "indian", "japanese", "korean", "thai"];
        //alert('You can enjoy ' + classNames[labelIndex] + ' cuisine today!');
        document.getElementById("result").innerText = 'You can enjoy ' + classNames[labelIndex] + ' cuisine today!';


    } catch (e) {
        console.log(`failed to inference ONNX model`);
        console.error(e);
    }
}    