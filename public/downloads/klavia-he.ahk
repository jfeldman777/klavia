; Klavia / Иврит — портативная раскладка для Windows (AutoHotkey v2)
; 1) Установите AutoHotkey v2: https://www.autohotkey.com/
; 2) Запустите этот файл — раскладка активна в любом приложении
; 3) Переключение: Pause — вкл/выкл
; Клавиши — физические QWERTY (сканкоды).
; J затем K M N F C — концевые ך ם ן ף ץ
; Письмо справа налево. Стандартный иврит Windows не подключается.
#Requires AutoHotkey v2.0
#SingleInstance Force
#UseHook True
SendMode "Input"

global KlaviaOn := true
global KlaviaLayer := false

ForceEng() {
    en := DllCall("LoadKeyboardLayout", "Str", "00000409", "UInt", 1, "ptr")
    if hwnd := WinExist("A")
        PostMessage 0x50, 0, en, hwnd  ; не стандартный иврит Windows
}

EnsureRtl() {
    hCtrl := 0
    try hCtrl := ControlGetHwnd(ControlGetFocus("A"), "A")
    if !hCtrl
        return
    getFn := A_PtrSize = 8 ? "GetWindowLongPtrW" : "GetWindowLongW"
    setFn := A_PtrSize = 8 ? "SetWindowLongPtrW" : "SetWindowLongW"
    ex := DllCall(getFn, "ptr", hCtrl, "int", -20, "ptr")
    ; WS_EX_RIGHT | WS_EX_RTLREADING | WS_EX_LEFTSCROLLBAR
    DllCall(setFn, "ptr", hCtrl, "int", -20, "ptr", ex | 0x7000, "ptr")
    try SendMessage(0x04C8, 2, 2, hCtrl)  ; EM_SETBIDIOPTIONS, BOE_RTLREADING
}

SendHe(ch) {
    EnsureRtl()
    SendText ch
}

ForceEng()
TrayTip "Klavia", "Иврит справа налево. Pause — вкл/выкл."

Pause:: {
    global KlaviaOn, KlaviaLayer
    KlaviaOn := !KlaviaOn
    KlaviaLayer := false
    if KlaviaOn
        ForceEng()
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
    SendHe("ך")
    KlaviaLayer := false
}
+SC025:: {
    global KlaviaLayer
    SendHe("ך")
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC032:: {  ; M → ם
    global KlaviaLayer
    SendHe("ם")
    KlaviaLayer := false
}
+SC032:: {
    global KlaviaLayer
    SendHe("ם")
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC031:: {  ; N → ן
    global KlaviaLayer
    SendHe("ן")
    KlaviaLayer := false
}
+SC031:: {
    global KlaviaLayer
    SendHe("ן")
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC021:: {  ; F → ף
    global KlaviaLayer
    SendHe("ף")
    KlaviaLayer := false
}
+SC021:: {
    global KlaviaLayer
    SendHe("ף")
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
SC02E:: {  ; C → ץ
    global KlaviaLayer
    SendHe("ץ")
    KlaviaLayer := false
}
+SC02E:: {
    global KlaviaLayer
    SendHe("ץ")
    KlaviaLayer := false
}

#HotIf KlaviaOn && !KlaviaLayer

SC010::SendHe("ק")  ; Q коф
+SC010::SendHe("ק")
SC011::SendHe("ו")  ; W вав
+SC011::SendHe("ו")
SC012::SendHe("ה")  ; E хей
+SC012::SendHe("ה")
SC014::SendHe("ט")  ; T тет
+SC014::SendHe("ט")
SC015::SendHe("ע")  ; Y айн
+SC015::SendHe("ע")
SC017::SendHe("י")  ; I йуд
+SC017::SendHe("י")
SC018::SendHe("ס")  ; O самех
+SC018::SendHe("ס")
SC019::SendHe("ר")  ; P реш
+SC019::SendHe("ר")
SC01E::SendHe("א")  ; A алеф
+SC01E::SendHe("א")
SC01F::SendHe("ש")  ; S шин/син
+SC01F::SendHe("ש")
SC020::SendHe("ד")  ; D далет
+SC020::SendHe("ד")
SC021::SendHe("פ")  ; F фей
+SC021::SendHe("פ")
SC022::SendHe("ג")  ; G гимел
+SC022::SendHe("ג")
SC025::SendHe("כ")  ; K каф
+SC025::SendHe("כ")
SC026::SendHe("ל")  ; L ламед
+SC026::SendHe("ל")
SC02C::SendHe("ז")  ; Z зайн
+SC02C::SendHe("ז")
SC02D::SendHe("ח")  ; X хет
+SC02D::SendHe("ח")
SC02E::SendHe("צ")  ; C цади
+SC02E::SendHe("צ")
SC02F::SendHe("ת")  ; V тав
+SC02F::SendHe("ת")
SC030::SendHe("ב")  ; B бет
+SC030::SendHe("ב")
SC031::SendHe("נ")  ; N нун
+SC031::SendHe("נ")
SC032::SendHe("מ")  ; M мем
+SC032::SendHe("מ")

#HotIf
