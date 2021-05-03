//*******DOM******** */

const options = document.getElementsByClassName("navbar-item");
const sections = document.getElementsByTagName("section");
const categoryNew = document.getElementById("category-new");
const categoriesEdit = document.getElementById("edit-categories");
const categoriesForm = document.getElementById("categories-form");
const newInputCategory = document.getElementById("new-input-category");
const balanceButton = document.getElementById("balance-button");
const balanceSection = document.getElementById("balance-section");
const formElementsNewOperation = document.querySelectorAll(
  "#operationnew input[data-owner], #operationnew select[data-owner]"
);
const formNewOperation = document.getElementById("form-operationnew");
const listOperations = document.getElementById("operations");

const formElementsEditOperation = document
  .querySelector("#edit-operation")
  .querySelectorAll("input[data-owner], select[data-owner]");

const categoriesReport = document.getElementById(
  "categories-report"
);
const reportResumen = document.getElementById("resume-report");



//******EVENTS****** */

console.log(sections, "Objecto");
const sectionsList = [...sections];

const views = (page) => {
  sectionsList.forEach((section) => {
    if (section.id === page) {
      section.classList.remove("is-hidden");
    } else {
      section.classList.add("is-hidden");
    }
  });
  console.log(sectionsList);
};


const generateId = () => {
  let p1 = Math.floor(Math.random() * 0x10000).toString(16);
  let p2 = new Date().getTime();
  return `${p1}${p2}`;
};

const categories = [
  { id: "0", name: "Servicios" },
  { id: "1", name: "Trasporte" },
  { id: "2", name: "Educación" },
  { id: "3", name: "Trabajo" },
  { id: "4", name: "Comida" },
  { id: "5", name: "Deporte" },
];

let operations = [];
let operationEditar = {};
let reportsSections = {
  resumen: [],
  categoryTotal: [],
  totalesMes: [],
};

//Agregar categoría
const addCategory = () => {
  console.log("ejemplo");
  console.log(newInputCategory.value);
  if (newInputCategory.value != "") {
    categories.unshift({ id: generateId(), name: newInputCategory.value });
    chooseCategory();
    myCategoryList();
    newInputCategory.value = "";
  }
};

//Borrar categoría
const deleteCategory = (category) => {
  const value = categories.findIndex((e) => e.id == category);
  if (value >= 0) {
    categories.splice(value, 1);
    myCategoryList();
    chooseCategory();
  }
};



const myCategoryList = () => {
  categoriesForm.innerHTML = "";
  categories.forEach((category) => {
    let frame = document.createElement("div");
    frame.innerHTML = `
    <div class="columns">
      <div class="column">
        <span class="tag is-info is-light is-medium" style ="background-color: #2be9cc">${category.name}</span>
      </div>
      <div class="column">
        <div class="buttons">
          <button class="button is-white">Editar</button>
          <button class="button is-white">Eliminar</button>
        </div>
      </div>
    </div>
  `;

    let optionsButtons = frame.querySelectorAll(".button");
    optionsButtons[0].onclick = () => {
      editCategory(category.id); //Falta poder editar categoría !
    };
    optionsButtons[1].onclick = () => {
      deleteCategory(category.id);
    };
    categoriesForm.appendChild(frame);
  });
};

// Nueva Operación
const chooseCategory = () => {
  categoryNew.innerHTML = "";
  categories.forEach((category, index) => {
    categoryNew.options[index] = new Option(category.name, category.name);
    categoriesEdit.options[index] = new Option(category.name, category.name);
  });
};

//Operaciones
const seeNewOperation = () => {
  formNewOperation.reset();
  views("operationnew");
};

const addOperation = () => {
  let operation = {};
  for (let i = 0; i < formElementsNewOperation.length; i++) {
    operation["id"] = generateId();
    operation[formElementsNewOperation[i].getAttribute("name")] =
      formElementsNewOperation[i].value;
  }
  //console.log(operation);
  operations.push(operation);
  addLocalStorage("operations", operations);
  myOperationsList();
  views("home");
};

const myOperationsList = () => {
  listOperations.innerHTML = "";
  if (localStorage.getItem("operations")) {
    operations = myLocalStorage("operations");
    if (operations.length > 0) {
      operations.forEach((operation) => {
        let frame = document.createElement("div");
        frame.innerHTML = `<div class="columns has-text-weight-medium is-mobile">
        <div class="column">${operation.description}</div>
        <div class="column">
          <span class="tag is-info is-light is-medium" style ="background-color: #2be9cc"
            >${operation.category}</span
          >
        </div>
        <div class="column">${operation.date}</div>
        <div class="column">${operation.monto}</div>
        <div class="column">
          <button class="button is-success is-inverted is-small" >
            <i class="far fa-money-check-edit-alt"></i>
          </button>
          <button class="button is-danger is-inverted is-small" >
            <i class="fas fa-eraser"></i>
          </button>
        </div>
      </div>`;

        let optionsButtons = frame.querySelectorAll(".button");
        optionsButtons[0].onclick = () => {
          editOperation(operation.id);
        };
        optionsButtons[1].onclick = () => {
          deleteOperation(operation.id);
        };

        listOperations.appendChild(frame);
      });
    }
  }
};

//Eliminar operación
const deleteOperation = (id) => {
  const value = operations.findIndex((e) => e.id == id);
  if (value >= 0) {
    operations.splice(value, 1);
    addLocalStorage("operations", operations);
    myOperationsList();
  }
};

//Editar operación
const editOperation = (id) => {
  views("edit-operation");
  operationEditar = operations.find((operation) => operation.id === id);
  for (let i = 0; i < formElementsEditOperation.length; i++) {
    formElementsEditOperation[i].value =
      operationEditar[formElementsEditOperation[i].getAttribute("name")];
  }
};

const confirmEditOperation = () => {
  for (let i = 0; i < formElementsEditOperation.length; i++) {
    operationEditar[formElementsEditOperation[i].getAttribute("name")] =
      formElementsEditOperation[i].value;
  }

  const posOperation = operations.findIndex((e) => e.id === operationEditar.id);
  operations.splice(posOperation, 1, operationEditar);
  addLocalStorage("operations", operations);
  myOperationsList();
  views("home");
};

const cancel = () => {
  views("home");
};

//reports
makeReport = () => {
  views("reports");
  let totalReportCategory = [];
  categories.forEach((category) => {
    let itemReport = {
      category: category.name,
      ganancia: 0,
      gasto: 0,
      balance: 0,
    };
    operations.forEach((operation) => {
      if (category.name === operation.category) {
        if (operation.type === "Gasto") {
          itemReport.gasto += parseFloat(operation.monto);
        }
        if (operation.type === "Ganancia") {
          itemReport.ganancia += parseFloat(operation.monto);
        }
      }
    });
    itemReport.balance = itemReport.ganancia - itemReport.gasto;
    totalReportCategory.push(itemReport);
  });
  reportsSections.categoryTotal = totalReportCategory;

  let maxGanancia = getMaximosCategory("ganancia");
  let maxGasto = getMaximosCategory("gasto");
  let maxBalance = getMaximosCategory("balance");

  reportsSections.resumen.push({
    title: "Categoría con mayor ganancia",
    category: maxGanancia.category,
    monto: maxGanancia.ganancia,
  });
  reportsSections.resumen.push({
    title: "Categoría con mayor gasto",
    category: maxGasto.category,
    monto: maxGasto.gasto,
  });
  reportsSections.resumen.push({
    title: "Categoría con mayor balance",
    category: maxBalance.category,
    monto: maxBalance.balance,
  });
  paintReports();
};

const getMaximosCategory = (campo) => {
  return reportsSections.categoryTotal.reduce((prev, current) =>
    prev[campo] > current[campo] ? prev : current
  );
};

paintReports = () => {
  categoriesReport.innerHTML = "";
  reportsSections.categoryTotal.forEach((category) => {
    let frame = document.createElement("div");
    frame.innerHTML = `
    <div class="columns has-text-weight-medium is-mobile">
    <div class="column">${category.category}</div>
    <div class="column">${category.ganancia}</div>
    <div class="column">${category.gasto}</div>
    <div class="column">${category.balance}</div>
  </div>
  `;
    categoriesReport.appendChild(frame);
  });

  reportResumen.innerHTML = "";
  reportsSections.resumen.forEach((resumen) => {
    let frame = document.createElement("div");
    frame.innerHTML = `
    <div class="columns has-text-weight-medium is-mobile">
      <div class="column">${resumen.title}</div>
      <div class="column">
        <span class="tag is-info is-light is-medium" style ="background-color: #2be9cc">${resumen.category}</span>
      </div>
      <div class="column">${resumen.monto}</div>
    </div>
  `;
    reportResumen.appendChild(frame);
  });
};

//Local Storage
const addLocalStorage = (property, value) => {
  localStorage.setItem(property, JSON.stringify(value));
};

const myLocalStorage = (property) => {
  return JSON.parse(localStorage.getItem(property));
};

const principal = () => {
  chooseCategory();
  myCategoryList();
  myOperationsList();
};

principal();

// Menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});