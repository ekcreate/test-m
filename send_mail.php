<?php
// Устанавливаем заголовок, чтобы браузер понимал, что это JSON
header('Content-Type: application/json; charset=utf-8');

// Функция для отправки ответа
function send_json_response($status, $message) {
    http_response_code($status === 'success' ? 200 : 400);
    echo json_encode(['status' => $status, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // === КОНФИГУРАЦИЯ ===
    $to = "ek@land-torg.ru"; // ЗАМЕНИТЕ НА ВАШ EMAIL
    $subject_prefix = "Новая заявка с сайта";
    $from_email_default = "noreply@" . (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'site.com');
    $from_name_default = "Уведомление с сайта";

    // Словарь для перевода полей на русский язык
    $field_translations = [
        'name' => 'Имя',
        'user_name' => 'Имя',
        'phone' => 'Телефон',
        'user_phone' => 'Телефон',
        'email' => 'Email',
        'user_email' => 'Email',
        'request' => 'Запрос',
        'message' => 'Сообщение',
        'form_name' => 'Форма',
    ];
    // === КОНЕЦ КОНФИГУРАЦИИ ===

    // Проверяем, что есть хоть какие-то данные
    if (empty($_POST)) {
        send_json_response('error', 'Нет данных для отправки.');
    }

    // Проверяем обязательное поле phone, если оно есть
    if (isset($_POST['phone']) && empty(trim($_POST['phone']))) {
        send_json_response('error', 'Пожалуйста, заполните поле "Телефон".');
    }

    // Валидация email, если он есть
    if (isset($_POST['email']) && !empty(trim($_POST['email'])) && !filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)) {
        send_json_response('error', 'Пожалуйста, введите корректный email.');
    }

    $from_name = !empty($_POST['name']) ? strip_tags(trim($_POST['name'])) : $from_name_default;
    $from_email = !empty($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : $from_email_default;
    $form_name = !empty($_POST['form_name']) ? strip_tags(trim($_POST['form_name'])) : "Неизвестная форма";

    $email_content = "Получено новое сообщение с формы '$form_name':\n\n";

    // Собираем все поля из формы в тело письма
    foreach ($_POST as $key => $value) {
        if ($key == 'form_name' || empty(trim($value))) {
            continue;
        }
        // Используем перевод из словаря или оставляем как есть
        $key_formatted = isset($field_translations[$key]) ? $field_translations[$key] : ucfirst($key);
        $email_content .= htmlspecialchars($key_formatted) . ": " . htmlspecialchars(strip_tags(trim($value))) . "\n";
    }

    $subject = "$subject_prefix: $form_name";
    $email_headers = "From: \"$from_name\" <$from_email_default>" . "\r\n" .
                     "Reply-To: $from_email";

    // Отправка письма
    if (mail($to, $subject, $email_content, $email_headers)) {
        send_json_response('success', 'Спасибо! Ваше сообщение успешно отправлено.');
    } else {
        // Ошибка на стороне сервера
        http_response_code(500);
        send_json_response('error', 'Что-то пошло не так, и мы не смогли отправить ваше сообщение.');
    }

} else {
    // Если кто-то пытается зайти на скрипт напрямую
    http_response_code(403);
    send_json_response('error', 'Доступ запрещен.');
}
?>