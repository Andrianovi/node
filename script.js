//@ Получаем элементы страницы
// Основной контейнер, в котором лежат все группы
const groupsContainer = document.getElementById('groups-container');

// Кнопки
const createGroupBtn = document.getElementById('create-group');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const fileInput = document.getElementById('file-input');



//@ Функция создания ссылки
// 🆕 Функция СОЗДАЁТ элемент "ссылка"
function createLink(name = 'Новая ссылка', url = '#') {

	// 🆕 Создаём div для ссылки
	const linkDiv = document.createElement('div');

	// 🆕 Добавляем класс (нужен для делегирования событий)
	linkDiv.className = 'link';

	// 🔄 Вставляем HTML без JS-логики
	linkDiv.innerHTML = `
			<a href="${url}" target="_blank">${name}</a>
			<button class="edit-name">изменить название</button>
			<button class="edit-url">изменить адрес</button>
			<button class="delete-link">удалить ссылку</button>
	;`

	// 🔄 ВАЖНО: здесь больше НЕТ onclick

	return linkDiv; // ✅ БЫЛО
}

//*@ Функция создания группы
// 🆕 Функция СОЗДАЁТ группу
function createGroup(name = 'Новая группа') {

	const groupDiv = document.createElement('div'); // ✅ БЫЛО
	groupDiv.className = 'group'; // 🆕 класс группы

	groupDiv.innerHTML = `
			<p class="group-name">${name}</p>
			<button class="edit-group">изменить название</button>
			<button class="delete-group">удалить группу</button>
			<br><br>
			<button class="create-link">Создать ссылку</button>
	;`

	return groupDiv; // ✅ БЫЛО
}



//*@ Создание новой группы по кнопке
createGroupBtn.onclick = () => {
	groupsContainer.appendChild(createGroup());
};





//*@ Делегирование событий
// 🆕 Ловим ВСЕ клики внутри контейнера
groupsContainer.addEventListener('click', (event) => {

	const target = event.target; // элемент, по которому кликнули

	// ===== КНОПКИ ГРУПП =====

	// 🆕 Создание ссылки внутри группы
	if (target.classList.contains('create-link')) {
		const group = target.closest('.group'); // ищем родительскую группу
		group.insertBefore(createLink(), target); // вставляем ссылку перед кнопкой
	}

	// 🆕 Удаление группы
	if (target.classList.contains('delete-group')) {
		target.closest('.group').remove();
	}

	// 🆕 Редактирование названия группы
	if (target.classList.contains('edit-group')) {
		const title = target.previousElementSibling; // <p>
		showTextarea(title, title.textContent);
	}

	// ===== КНОПКИ ССЫЛОК =====

	// 🆕 Удаление ссылки
	if (target.classList.contains('delete-link')) {
		target.closest('.link').remove();
	}

	// 🆕 Редактирование названия ссылки
	if (target.classList.contains('edit-name')) {
		const a = target.parentElement.querySelector('a');
		showTextarea(a, a.textContent);
	}

	// 🆕 Редактирование адреса ссылки
	if (target.classList.contains('edit-url')) {
		const a = target.parentElement.querySelector('a');
		showTextarea(a, a.href, true);
	}

});





//*@ Редактирование через <textarea></textarea>
// 🆕 Показывает textarea для редактирования текста
function showTextarea(element, value, isUrl = false) {

	const textarea = document.createElement('textarea'); // поле ввода
	textarea.value = value; // текущее значение
	textarea.style.width = '100%'; // растягиваем по ширине

	const saveBtn = document.createElement('button'); // кнопка сохранения
	saveBtn.textContent = 'Сохранить';

	const wrapper = document.createElement('div'); // обёртка
	wrapper.append(textarea, saveBtn); // добавляем textarea и кнопку

	element.replaceWith(wrapper); // заменяем текст на поле ввода

	// 🆕 Сохранение данных
	saveBtn.onclick = () => {

		// если редактируем URL
		if (isUrl) {
			const a = document.createElement('a');
			a.href = textarea.value;
			a.textContent = textarea.value;
			a.target = '_blank';
			wrapper.replaceWith(a);
		}
		// если редактируем обычный текст
		else {
			element.textContent = textarea.value;
			wrapper.replaceWith(element);
		}
	};
}






//*@ Автосохранение каждые 2 секунды 
// Каждые 2 секунды сохраняем текущее состояние страницы
setInterval(() => {
	localStorage.setItem('pageData', groupsContainer.innerHTML);
}, 2000);


//*@ Восстановление при загрузке страницы
window.onload = () => {
	const savedData = localStorage.getItem('pageData');

	if (savedData) {
		groupsContainer.innerHTML = savedData;
	}
};



//*@ Скачивание файла
downloadBtn.onclick = () => {

	// Берём сохранённые данные
	const data = localStorage.getItem('pageData');

	// Создаём файл из текста
	const blob = new Blob([data], { type: 'text/html' });

	// Создаём временную ссылку для скачивания
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'data.html';

	// "Нажимаем" на ссылку
	a.click();
};



//*@ Загрузка файла
// При нажатии "Загрузить файл" — открываем выбор файла
uploadBtn.onclick = () => {
	fileInput.click();
};

// Когда файл выбран
fileInput.onchange = () => {

	const file = fileInput.files[0];
	const reader = new FileReader();

	// Когда файл прочитан
	reader.onload = () => {

		// Вставляем данные на страницу
		groupsContainer.innerHTML = reader.result;

		// И сохраняем в localStorage
		localStorage.setItem('pageData', reader.result);
	};

	// Читаем файл как текст
	reader.readAsText(file);
};