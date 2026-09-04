; Klavia / Совпад — портативная раскладка для Windows (AutoHotkey v2)
; 1) Установите AutoHotkey v2: https://www.autohotkey.com/
; 2) Запустите этот файл — раскладка активна в любом приложении
; 3) Переключение: Pause (или правый Ctrl+Space) — вкл/выкл
; Q затем 1–0 — миниклавиатура оставшихся букв
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

q:: {
    global KlaviaLayer
    KlaviaLayer := true
}
+q:: {
    global KlaviaLayer
    KlaviaLayer := true
}

#HotIf KlaviaOn && KlaviaLayer
1:: {
    global KlaviaLayer
    SendText "б"
    KlaviaLayer := false
}
+1:: {
    global KlaviaLayer
    SendText "Б"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
2:: {
    global KlaviaLayer
    SendText "п"
    KlaviaLayer := false
}
+2:: {
    global KlaviaLayer
    SendText "П"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
3:: {
    global KlaviaLayer
    SendText "ш"
    KlaviaLayer := false
}
+3:: {
    global KlaviaLayer
    SendText "Ш"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
4:: {
    global KlaviaLayer
    SendText "щ"
    KlaviaLayer := false
}
+4:: {
    global KlaviaLayer
    SendText "Щ"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
5:: {
    global KlaviaLayer
    SendText "ц"
    KlaviaLayer := false
}
+5:: {
    global KlaviaLayer
    SendText "Ц"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
6:: {
    global KlaviaLayer
    SendText "ъ"
    KlaviaLayer := false
}
+6:: {
    global KlaviaLayer
    SendText "Ъ"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
7:: {
    global KlaviaLayer
    SendText "ы"
    KlaviaLayer := false
}
+7:: {
    global KlaviaLayer
    SendText "Ы"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
8:: {
    global KlaviaLayer
    SendText "ь"
    KlaviaLayer := false
}
+8:: {
    global KlaviaLayer
    SendText "Ь"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
9:: {
    global KlaviaLayer
    SendText "э"
    KlaviaLayer := false
}
+9:: {
    global KlaviaLayer
    SendText "Э"
    KlaviaLayer := false
}

#HotIf KlaviaOn && KlaviaLayer
0:: {
    global KlaviaLayer
    SendText "ё"
    KlaviaLayer := false
}
+0:: {
    global KlaviaLayer
    SendText "Ё"
    KlaviaLayer := false
}

#HotIf KlaviaOn && !KlaviaLayer

e::SendText "е"
+e::SendText "Е"
r::SendText "я"
+r::SendText "Я"
t::SendText "т"
+t::SendText "Т"
y::SendText "у"
+y::SendText "У"
u::SendText "ю"
+u::SendText "Ю"
i::SendText "й"
+i::SendText "Й"
o::SendText "о"
+o::SendText "О"
p::SendText "р"
+p::SendText "Р"
a::SendText "а"
+a::SendText "А"
s::SendText "ч"
+s::SendText "Ч"
d::SendText "д"
+d::SendText "Д"
f::SendText "ф"
+f::SendText "Ф"
g::SendText "г"
+g::SendText "Г"
h::SendText "н"
+h::SendText "Н"
j::SendText "ж"
+j::SendText "Ж"
k::SendText "к"
+k::SendText "К"
l::SendText "л"
+l::SendText "Л"
z::SendText "з"
+z::SendText "З"
x::SendText "х"
+x::SendText "Х"
c::SendText "с"
+c::SendText "С"
b::SendText "в"
+b::SendText "В"
n::SendText "и"
+n::SendText "И"
m::SendText "м"
+m::SendText "М"

#HotIf
