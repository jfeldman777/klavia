; Klavia / Иврит — портативная раскладка для Windows (AutoHotkey v2)
; 1) Установите AutoHotkey v2: https://www.autohotkey.com/
; 2) Запустите этот файл — раскладка активна в любом приложении
; 3) Переключение: Pause — вкл/выкл
; Клавиши — физические QWERTY (сканкоды).
; J затем K M N F C — концевые ך ם ן ף ץ
#Requires AutoHotkey v2.0
#SingleInstance Force
SendMode "Input"

global KlaviaOn := true
global KlaviaLayer := false

TrayTip "Klavia", "Иврит включён. Pause — вкл/выкл. J — концевые."

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

SC024:: {  ; J — слой концевых
    global KlaviaLayer
    KlaviaLayer := true
}
+SC024:: {
    global KlaviaLayer
    KlaviaLayer := true
}

#HotIf KlaviaOn && KlaviaLayer
SC025:: {  ; K → ך
    global KlaviaLayer
    SendText "ך"
    KlaviaLayer := false
}
+SC025:: {
    global KlaviaLayer
    SendText "ך"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC032:: {  ; M → ם
    global KlaviaLayer
    SendText "ם"
    KlaviaLayer := false
}
+SC032:: {
    global KlaviaLayer
    SendText "ם"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC031:: {  ; N → ן
    global KlaviaLayer
    SendText "ן"
    KlaviaLayer := false
}
+SC031:: {
    global KlaviaLayer
    SendText "ן"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC021:: {  ; F → ף
    global KlaviaLayer
    SendText "ף"
    KlaviaLayer := false
}
+SC021:: {
    global KlaviaLayer
    SendText "ף"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC02E:: {  ; C → ץ
    global KlaviaLayer
    SendText "ץ"
    KlaviaLayer := false
}
+SC02E:: {
    global KlaviaLayer
    SendText "ץ"
    KlaviaLayer := false
}

#HotIf KlaviaOn && !KlaviaLayer

SC010::SendText "ק"  ; Q коф
+SC010::SendText "ק"
SC011::SendText "ו"  ; W вав
+SC011::SendText "ו"
SC012::SendText "ה"  ; E хей
+SC012::SendText "ה"
SC014::SendText "ט"  ; T тет
+SC014::SendText "ט"
SC015::SendText "ע"  ; Y айн
+SC015::SendText "ע"
SC017::SendText "י"  ; I йуд
+SC017::SendText "י"
SC018::SendText "ס"  ; O самех
+SC018::SendText "ס"
SC019::SendText "ר"  ; P реш
+SC019::SendText "ר"
SC01E::SendText "א"  ; A алеф
+SC01E::SendText "א"
SC01F::SendText "ש"  ; S шин/син
+SC01F::SendText "ש"
SC020::SendText "ד"  ; D далет
+SC020::SendText "ד"
SC021::SendText "פ"  ; F фей
+SC021::SendText "פ"
SC022::SendText "ג"  ; G гимел
+SC022::SendText "ג"
SC025::SendText "כ"  ; K каф
+SC025::SendText "כ"
SC026::SendText "ל"  ; L ламед
+SC026::SendText "ל"
SC02C::SendText "ז"  ; Z зайн
+SC02C::SendText "ז"
SC02D::SendText "ח"  ; X хет
+SC02D::SendText "ח"
SC02E::SendText "צ"  ; C цади
+SC02E::SendText "צ"
SC02F::SendText "ת"  ; V тав
+SC02F::SendText "ת"
SC030::SendText "ב"  ; B бет
+SC030::SendText "ב"
SC031::SendText "נ"  ; N нун
+SC031::SendText "נ"
SC032::SendText "מ"  ; M мем
+SC032::SendText "מ"

#HotIf
