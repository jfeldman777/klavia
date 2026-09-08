; Klavia / Совпад — портативная раскладка для Windows (AutoHotkey v2)
; 1) Установите AutoHotkey v2: https://www.autohotkey.com/
; 2) Запустите этот файл — раскладка активна в любом приложении
; 3) Переключение: Pause — вкл/выкл
; Клавиши — физические QWERTY (сканкоды), работают поверх русской раскладки.
; V → Б. Q затем 2–0 — П Ш Щ Ц Ъ Ы Ь Э Ё
#Requires AutoHotkey v2.0
#SingleInstance Force
SendMode "Input"

global KlaviaOn := true
global KlaviaLayer := false

TrayTip "Klavia", "Раскладка включена. Pause — вкл/выкл."

Pause:: {
    global KlaviaOn, KlaviaLayer
    KlaviaOn := !KlaviaOn
    KlaviaLayer := false
    TrayTip "Klavia", KlaviaOn ? "Включено" : "Выключено"
}

Esc:: {
    global KlaviaLayer
    if KlaviaLayer {
        KlaviaLayer := false
        return
    }
    Send "{Esc}"
}

#HotIf KlaviaOn

SC010:: {  ; Q
    global KlaviaLayer
    KlaviaLayer := true
}
+SC010:: {
    global KlaviaLayer
    KlaviaLayer := true
}

#HotIf KlaviaOn && KlaviaLayer
SC003:: {  ; 2 → П
    global KlaviaLayer
    SendText "п"
    KlaviaLayer := false
}
+SC003:: {
    global KlaviaLayer
    SendText "П"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC004:: {  ; 3 → Ш
    global KlaviaLayer
    SendText "ш"
    KlaviaLayer := false
}
+SC004:: {
    global KlaviaLayer
    SendText "Ш"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC005:: {  ; 4 → Щ
    global KlaviaLayer
    SendText "щ"
    KlaviaLayer := false
}
+SC005:: {
    global KlaviaLayer
    SendText "Щ"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC006:: {  ; 5 → Ц
    global KlaviaLayer
    SendText "ц"
    KlaviaLayer := false
}
+SC006:: {
    global KlaviaLayer
    SendText "Ц"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC007:: {  ; 6 → Ъ
    global KlaviaLayer
    SendText "ъ"
    KlaviaLayer := false
}
+SC007:: {
    global KlaviaLayer
    SendText "Ъ"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC008:: {  ; 7 → Ы
    global KlaviaLayer
    SendText "ы"
    KlaviaLayer := false
}
+SC008:: {
    global KlaviaLayer
    SendText "Ы"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC009:: {  ; 8 → Ь
    global KlaviaLayer
    SendText "ь"
    KlaviaLayer := false
}
+SC009:: {
    global KlaviaLayer
    SendText "Ь"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC00A:: {  ; 9 → Э
    global KlaviaLayer
    SendText "э"
    KlaviaLayer := false
}
+SC00A:: {
    global KlaviaLayer
    SendText "Э"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC00B:: {  ; 0 → Ё
    global KlaviaLayer
    SendText "ё"
    KlaviaLayer := false
}
+SC00B:: {
    global KlaviaLayer
    SendText "Ё"
    KlaviaLayer := false
}

#HotIf KlaviaOn && !KlaviaLayer

SC012::SendText "е"  ; E
+SC012::SendText "Е"
SC013::SendText "я"  ; R
+SC013::SendText "Я"
SC014::SendText "т"  ; T
+SC014::SendText "Т"
SC015::SendText "у"  ; Y
+SC015::SendText "У"
SC016::SendText "ю"  ; U
+SC016::SendText "Ю"
SC017::SendText "й"  ; I
+SC017::SendText "Й"
SC018::SendText "о"  ; O
+SC018::SendText "О"
SC019::SendText "р"  ; P
+SC019::SendText "Р"
SC01E::SendText "а"  ; A
+SC01E::SendText "А"
SC01F::SendText "ч"  ; S
+SC01F::SendText "Ч"
SC020::SendText "д"  ; D
+SC020::SendText "Д"
SC021::SendText "ф"  ; F
+SC021::SendText "Ф"
SC022::SendText "г"  ; G
+SC022::SendText "Г"
SC023::SendText "н"  ; H
+SC023::SendText "Н"
SC024::SendText "ж"  ; J
+SC024::SendText "Ж"
SC025::SendText "к"  ; K
+SC025::SendText "К"
SC026::SendText "л"  ; L
+SC026::SendText "Л"
SC02C::SendText "з"  ; Z
+SC02C::SendText "З"
SC02D::SendText "х"  ; X
+SC02D::SendText "Х"
SC02E::SendText "с"  ; C
+SC02E::SendText "С"
SC02F::SendText "б"  ; V → Б
+SC02F::SendText "Б"
SC030::SendText "в"  ; B → В
+SC030::SendText "В"
SC031::SendText "и"  ; N
+SC031::SendText "И"
SC032::SendText "м"  ; M
+SC032::SendText "М"

#HotIf
