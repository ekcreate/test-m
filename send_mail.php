<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // === КОНФИГУРАЦИЯ ===
    $to = "your-email@example.com"; // ЗАМЕНИТЕ НА ВАШ EMAIL
    $subject_prefix = "Новая заявка с сайта";
    // Определяем поля, которые должны быть в письме обязательно.
    // Если в форме есть поле с атрибутом name="name", name="phone" или name="email", скрипт проверит, что оно не пустое.
    $required_fields = ['name', 'phone', 'email'];
    // === КОНЕЦ КОНФИГУРАЦИИ ===

    $email_content = "";
    $form_name = "Неизвестная форма";
    $from_email = "noreply@" . (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'site.com');
    $from_name = "Уведомление с сайта";

    // Проверяем обязательные поля, если они существуют в $_POST
    foreach ($required_fields as $field) {
        if (isset($_POST[$field]) && empty(trim($_POST[$field]))) {
            http_response_code(400);
            echo "Пожалуйста, заполните обязательное поле: " . htmlspecialchars($field);
            exit;
        }
    }

    // Проверяем валидность email, если он есть
    if (isset($_POST['email']) && !filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Пожалуйста, введите корректный email.";
        exit;
    }

    // Устанавливаем имя и email отправителя для заголовков письма
    if (!empty($_POST['name'])) {
        $from_name = strip_tags(trim($_POST["name"]));
    }
    if(!empty($_POST['email'])) {
        $from_email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    }

    // Устанавливаем название формы из скрытого поля, если оно есть
    if (!empty($_POST['form_name'])) {
      $form_name = strip_tags(trim($_POST['form_name']));
    }

    $email_content .= "Получено новое сообщение с формы '$form_name':\n\n";

    // Собираем все поля из формы в тело письма
    foreach ($_POST as $key => $value) {
        // Пропускаем служебные поля
        if ($key == 'form_name' || $key == 'submit') {
            continue;
        }
        $key_formatted = ucfirst(str_replace(['_', '-'], ' ', $key));
        $email_content .= htmlspecialchars($key_formatted) . ": " . htmlspecialchars(strip_tags(trim($value))) . "\n";
    }

    $subject = "$subject_prefix: $form_name";
    $email_headers = "From: $from_name <$from_email>";
    $email_headers .= "\r\nReply-To: $from_email";

    // Отправка письма
    if (mail($to, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Спасибо! Ваше сообщение отправлено.";
    } else {
        http_response_code(500);
        echo "Что-то пошло не так, и мы не смогли отправить ваше сообщение.";
    }

} else {
    http_response_code(403);
    echo "Произошла ошибка при отправке формы. Попробуйте еще раз.";
}
?>
