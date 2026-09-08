; Klavia — переключение раскладок (AutoHotkey v2)
; Pause — по кругу:
;   РУ → АНГЛ → ИВРИТ → РУ-КЛАВИА → ИВРИТ-КЛАВИА → …
; Правый клик по иконке в трее — выбрать режим сразу.
; РУ / АНГЛ / ИВРИТ — стандарт Windows.
; РУ-КЛАВИА: Совпад. Q затем 2–0 — П Ш Щ Ц Ъ Ы Ь Э Ё. V → Б
; ИВРИТ-КЛАВИА: карта Совпад, справа налево. J затем K M N F C — концевые
#Requires AutoHotkey v2.0
#SingleInstance Force
#UseHook True
SendMode "Input"

global KlaviaMode := "std-ru"
global KlaviaLayer := false

SetOsLayout(id) {
    h := DllCall("LoadKeyboardLayout", "Str", id, "UInt", 1, "ptr")
    if hwnd := WinExist("A")
        PostMessage 0x50, 0, h, hwnd
}

EnsureRtl() {
    hCtrl := 0
    try hCtrl := ControlGetHwnd(ControlGetFocus("A"), "A")
    if !hCtrl
        return
    getFn := A_PtrSize = 8 ? "GetWindowLongPtrW" : "GetWindowLongW"
    setFn := A_PtrSize = 8 ? "SetWindowLongPtrW" : "SetWindowLongW"
    ex := DllCall(getFn, "ptr", hCtrl, "int", -20, "ptr")
    DllCall(setFn, "ptr", hCtrl, "int", -20, "ptr", ex | 0x7000, "ptr")
    try SendMessage(0x04C8, 2, 2, hCtrl)
}

SendHe(ch) {
    EnsureRtl()
    SendText ch
}

ModeTitle(mode) {
    names := Map(
        "std-ru", "РУ",
        "std-en", "АНГЛ",
        "std-he", "ИВРИТ",
        "k-ru", "РУ-КЛАВИА",
        "k-he", "ИВРИТ-КЛАВИА"
    )
    return names.Has(mode) ? names[mode] : mode
}

ApplyMode(mode) {
    global KlaviaMode, KlaviaLayer
    KlaviaMode := mode
    KlaviaLayer := false
    switch mode {
        case "std-ru": SetOsLayout("00000419")
        case "std-en": SetOsLayout("00000409")
        case "std-he": SetOsLayout("0000040D")
        case "k-ru": SetOsLayout("00000409")
        case "k-he": SetOsLayout("00000409")
    }
    TrayTip "Klavia", ModeTitle(mode)
}

NextMode() {
    global KlaviaMode
    modes := ["std-ru", "std-en", "std-he", "k-ru", "k-he"]
    i := 1
    for m in modes {
        if (m = KlaviaMode) {
            n := i = modes.Length ? 1 : i + 1
            ApplyMode(modes[n])
            return
        }
        i += 1
    }
    ApplyMode("std-ru")
}

A_TrayMenu.Delete()
A_TrayMenu.Add("РУ", (*) => ApplyMode("std-ru"))
A_TrayMenu.Add("АНГЛ", (*) => ApplyMode("std-en"))
A_TrayMenu.Add("ИВРИТ", (*) => ApplyMode("std-he"))
A_TrayMenu.Add("РУ-КЛАВИА", (*) => ApplyMode("k-ru"))
A_TrayMenu.Add("ИВРИТ-КЛАВИА", (*) => ApplyMode("k-he"))
A_TrayMenu.Add()
A_TrayMenu.Add("Выход", (*) => ExitApp())

Pause:: NextMode()

Esc:: {
    global KlaviaLayer
    if KlaviaLayer {
        KlaviaLayer := false
        return
    }
    Send "{Esc}"
}

ApplyMode("std-ru")

; ===== РУ-КЛАВИА =====
#HotIf KlaviaMode = "k-ru"
SC010:: {  ; Q
    global KlaviaLayer
    KlaviaLayer := true
}
+SC010:: {
    global KlaviaLayer
    KlaviaLayer := true
}

#HotIf KlaviaMode = "k-ru" && KlaviaLayer
SC003:: {
    global KlaviaLayer
    SendText "п"
    KlaviaLayer := false
}
+SC003:: {
    global KlaviaLayer
    SendText "П"
    KlaviaLayer := false
}
SC004:: {
    global KlaviaLayer
    SendText "ш"
    KlaviaLayer := false
}
+SC004:: {
    global KlaviaLayer
    SendText "Ш"
    KlaviaLayer := false
}
SC005:: {
    global KlaviaLayer
    SendText "щ"
    KlaviaLayer := false
}
+SC005:: {
    global KlaviaLayer
    SendText "Щ"
    KlaviaLayer := false
}
SC006:: {
    global KlaviaLayer
    SendText "ц"
    KlaviaLayer := false
}
+SC006:: {
    global KlaviaLayer
    SendText "Ц"
    KlaviaLayer := false
}
SC007:: {
    global KlaviaLayer
    SendText "ъ"
    KlaviaLayer := false
}
+SC007:: {
    global KlaviaLayer
    SendText "Ъ"
    KlaviaLayer := false
}
SC008:: {
    global KlaviaLayer
    SendText "ы"
    KlaviaLayer := false
}
+SC008:: {
    global KlaviaLayer
    SendText "Ы"
    KlaviaLayer := false
}
SC009:: {
    global KlaviaLayer
    SendText "ь"
    KlaviaLayer := false
}
+SC009:: {
    global KlaviaLayer
    SendText "Ь"
    KlaviaLayer := false
}
SC00A:: {
    global KlaviaLayer
    SendText "э"
    KlaviaLayer := false
}
+SC00A:: {
    global KlaviaLayer
    SendText "Э"
    KlaviaLayer := false
}
SC00B:: {
    global KlaviaLayer
    SendText "ё"
    KlaviaLayer := false
}
+SC00B:: {
    global KlaviaLayer
    SendText "Ё"
    KlaviaLayer := false
}

#HotIf KlaviaMode = "k-ru" && !KlaviaLayer
SC012::SendText "е"
+SC012::SendText "Е"
SC013::SendText "я"
+SC013::SendText "Я"
SC014::SendText "т"
+SC014::SendText "Т"
SC015::SendText "у"
+SC015::SendText "У"
SC016::SendText "ю"
+SC016::SendText "Ю"
SC017::SendText "й"
+SC017::SendText "Й"
SC018::SendText "о"
+SC018::SendText "О"
SC019::SendText "р"
+SC019::SendText "Р"
SC01E::SendText "а"
+SC01E::SendText "А"
SC01F::SendText "ч"
+SC01F::SendText "Ч"
SC020::SendText "д"
+SC020::SendText "Д"
SC021::SendText "ф"
+SC021::SendText "Ф"
SC022::SendText "г"
+SC022::SendText "Г"
SC023::SendText "н"
+SC023::SendText "Н"
SC024::SendText "ж"
+SC024::SendText "Ж"
SC025::SendText "к"
+SC025::SendText "К"
SC026::SendText "л"
+SC026::SendText "Л"
SC02C::SendText "з"
+SC02C::SendText "З"
SC02D::SendText "х"
+SC02D::SendText "Х"
SC02E::SendText "с"
+SC02E::SendText "С"
SC02F::SendText "б"
+SC02F::SendText "Б"
SC030::SendText "в"
+SC030::SendText "В"
SC031::SendText "и"
+SC031::SendText "И"
SC032::SendText "м"
+SC032::SendText "М"

; ===== ИВРИТ-КЛАВИА =====
#HotIf KlaviaMode = "k-he"
SC024:: {  ; J — концевые
    global KlaviaLayer
    KlaviaLayer := true
}
+SC024:: {
    global KlaviaLayer
    KlaviaLayer := true
}

#HotIf KlaviaMode = "k-he" && KlaviaLayer
SC025:: {
    global KlaviaLayer
    SendHe("ך")
    KlaviaLayer := false
}
+SC025:: {
    global KlaviaLayer
    SendHe("ך")
    KlaviaLayer := false
}
SC032:: {
    global KlaviaLayer
    SendHe("ם")
    KlaviaLayer := false
}
+SC032:: {
    global KlaviaLayer
    SendHe("ם")
    KlaviaLayer := false
}
SC031:: {
    global KlaviaLayer
    SendHe("ן")
    KlaviaLayer := false
}
+SC031:: {
    global KlaviaLayer
    SendHe("ן")
    KlaviaLayer := false
}
SC021:: {
    global KlaviaLayer
    SendHe("ף")
    KlaviaLayer := false
}
+SC021:: {
    global KlaviaLayer
    SendHe("ף")
    KlaviaLayer := false
}
SC02E:: {
    global KlaviaLayer
    SendHe("ץ")
    KlaviaLayer := false
}
+SC02E:: {
    global KlaviaLayer
    SendHe("ץ")
    KlaviaLayer := false
}

#HotIf KlaviaMode = "k-he" && !KlaviaLayer
SC010::SendHe("ק")
+SC010::SendHe("ק")
SC011::SendHe("ו")
+SC011::SendHe("ו")
SC012::SendHe("ה")
+SC012::SendHe("ה")
SC014::SendHe("ט")
+SC014::SendHe("ט")
SC015::SendHe("ע")
+SC015::SendHe("ע")
SC017::SendHe("י")
+SC017::SendHe("י")
SC018::SendHe("ס")
+SC018::SendHe("ס")
SC019::SendHe("ר")
+SC019::SendHe("ר")
SC01E::SendHe("א")
+SC01E::SendHe("א")
SC01F::SendHe("ש")
+SC01F::SendHe("ש")
SC020::SendHe("ד")
+SC020::SendHe("ד")
SC021::SendHe("פ")
+SC021::SendHe("פ")
SC022::SendHe("ג")
+SC022::SendHe("ג")
SC025::SendHe("כ")
+SC025::SendHe("כ")
SC026::SendHe("ל")
+SC026::SendHe("ל")
SC02C::SendHe("ז")
+SC02C::SendHe("ז")
SC02D::SendHe("ח")
+SC02D::SendHe("ח")
SC02E::SendHe("צ")
+SC02E::SendHe("צ")
SC02F::SendHe("ת")
+SC02F::SendHe("ת")
SC030::SendHe("ב")
+SC030::SendHe("ב")
SC031::SendHe("נ")
+SC031::SendHe("נ")
SC032::SendHe("מ")
+SC032::SendHe("מ")

#HotIf
