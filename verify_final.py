import pytest
from playwright.sync_api import sync_playwright, Page, expect
import re

BASE_URL = "http://localhost:8000"

def test_mobile_menu_and_modal_interaction(page: Page):
    """
    Проверяет открытие и закрытие мобильного меню, а также открытие модального окна из него.
    """
    page.goto(f"{BASE_URL}/index.html")
    page.set_viewport_size({"width": 375, "height": 667})

    # Открываем мобильное меню
    menu_button = page.locator(".nav-toggle")
    mobile_menu = page.locator("#mobile-menu")
    expect(mobile_menu).to_be_hidden()
    menu_button.click()
    expect(mobile_menu).to_be_visible()

    # Проверяем наличие навигации
    nav_links = mobile_menu.locator(".mobile-nav a")
    expect(nav_links).to_have_count(9)

    # Закрываем меню, чтобы получить доступ к кнопке на главной
    close_menu_button = page.locator("#close-mobile-menu")
    close_menu_button.click()
    expect(mobile_menu).to_be_hidden()

    # Теперь кликаем на кнопку "Заявка", которая видна в мобильном виде
    modal_button = page.locator('.mobile-nav-right .pill-btn[data-open-modal="lead-modal"]')
    lead_modal = page.locator("#lead-modal")

    expect(lead_modal).to_be_hidden()
    modal_button.click()
    expect(lead_modal).to_be_visible()

    # Закрываем модальное окно
    close_modal_button = lead_modal.locator('[data-close-modal]')
    close_modal_button.click()
    expect(lead_modal).to_be_hidden()


def test_accordion_functionality(page: Page):
    """
    Проверяет работу аккордеона на главной странице.
    """
    page.goto(f"{BASE_URL}/index.html#how-we-work")

    # Уточняем селектор, чтобы выбирать только аккордеоны в нужной секции
    accordion_section = page.locator("#process-accordion")
    accordion_headers = accordion_section.locator(".accordion-header")
    expect(accordion_headers).to_have_count(4)

    first_header = accordion_headers.nth(0)
    first_body = first_header.locator("+ .accordion-body")

    expect(first_header).to_have_attribute("aria-expanded", "false")
    expect(first_body).not_to_have_class(re.compile(r'\bshow\b'))

    # Открываем первый элемент
    first_header.click()
    expect(first_header).to_have_attribute("aria-expanded", "true")
    expect(first_body).to_have_class(re.compile(r'\bshow\b'))

    # Закрываем первый элемент
    first_header.click()
    expect(first_header).to_have_attribute("aria-expanded", "false")
    expect(first_body).not_to_have_class(re.compile(r'\bshow\b'))


def test_tabs_functionality_on_services_page(page: Page):
    """
    Проверяет работу табов на странице "Услуги".
    """
    page.goto(f"{BASE_URL}/services.html")

    tab_buttons = page.locator(".services-menu button")
    tab_contents = page.locator(".service-category")

    expect(tab_buttons).to_have_count(5)
    expect(tab_contents).to_have_count(5)

    # Проверяем начальное состояние
    expect(tab_buttons.nth(0)).to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_contents.nth(0)).to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_buttons.nth(1)).not_to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_contents.nth(1)).not_to_have_attribute("class", re.compile(r'\bactive\b'))

    # Кликаем на второй таб
    tab_buttons.nth(1).click()

    # Проверяем, что второй таб и его содержимое стали активными
    expect(tab_buttons.nth(0)).not_to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_contents.nth(0)).not_to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_buttons.nth(1)).to_have_attribute("class", re.compile(r'\bactive\b'))
    expect(tab_contents.nth(1)).to_have_attribute("class", re.compile(r'\bactive\b'))

def test_back_to_top_button(page: Page):
    """
    Проверяет появление и работу кнопки "Наверх".
    """
    page.goto(f"{BASE_URL}/index.html")
    back_to_top_button = page.locator("#back-to-top")

    # Вначале кнопка не видна (проверяем opacity)
    expect(back_to_top_button).to_have_css("opacity", "0")

    # Прокручиваем страницу вниз
    page.evaluate("window.scrollTo(0, 500)")

    # Теперь кнопка должна быть видна
    expect(back_to_top_button).to_have_css("opacity", "1")

    # Кликаем на кнопку
    back_to_top_button.click()

    # Ждем, пока страница прокрутится наверх
    page.wait_for_function("() => window.scrollY === 0")

    # Убеждаемся, что мы наверху
    assert page.evaluate("window.scrollY") == 0
