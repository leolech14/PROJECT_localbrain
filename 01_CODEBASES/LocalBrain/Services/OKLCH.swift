import SwiftUI

public struct OKLCH { public var L, C, h: Double; public init(_ L: Double,_ C: Double,_ h: Double){self.L=L;self.C=C;self.h=h} }

extension Color {
    public static func oklch(_ L: Double,_ C: Double,_ hDeg: Double) -> Color {
        let h = hDeg * .pi/180
        let a = C * cos(h), b = C * sin(h)

        let l_ = L + 0.3963377774*a + 0.2158037573*b
        let m_ = L - 0.1055613458*a - 0.0638541728*b
        let s_ = L - 0.0894841775*a - 1.2914855480*b

        let l = l_*l_*l_, m = m_*m_*m_, s = s_*s_*s_
        func toSRGB(_ x: Double)->Double{ let y=max(0,min(1,x)); return y<=0.0031308 ? 12.92*y : 1.055*pow(y,1/2.4)-0.055 }
        return Color(red: toSRGB(+4.0767416621*l - 3.3077115913*m + 0.2309699292*s),
                     green: toSRGB(-1.2684380046*l + 2.6097574011*m - 0.3413193965*s),
                     blue: toSRGB(-0.0041960863*l - 0.7034186147*m + 1.7076147010*s))
    }
}

enum LBColor {
    // Pure grayscale with minimal saturation for harmony
    static let bg1     = Color.oklch(0.12, 0.005, 260) // Near black
    static let bg2     = Color.oklch(0.16, 0.005, 260) // Dark gray
    static let bg3     = Color.oklch(0.20, 0.005, 260) // Medium dark gray
    static let bg4     = Color.oklch(0.24, 0.005, 260) // Lighter gray
    static let surface = Color.oklch(0.18, 0.005, 260) // Surface gray
    static let tx1     = Color.oklch(0.95, 0.005, 260) // Near white text
    static let tx2     = Color.oklch(0.70, 0.005, 260) // Medium gray text
    static let tx3     = Color.oklch(0.50, 0.005, 260) // Dim gray text
    static let hair    = Color.oklch(0.30, 0.005, 260) // Subtle borders
    static let acc     = Color.oklch(0.75, 0.010, 260) // Subtle accent
    static let ok      = Color.oklch(0.70, 0.008, 260) // Success gray
    static let warn    = Color.oklch(0.65, 0.008, 260) // Warning gray
    static let err     = Color.oklch(0.60, 0.008, 260) // Error gray
}

// Add convenience extensions to Color directly
extension Color {
    static let bg1 = LBColor.bg1
    static let bg2 = LBColor.bg2
    static let bg3 = LBColor.bg3
    static let bg4 = LBColor.bg4
    static let surface = LBColor.surface
    static let tx1 = LBColor.tx1
    static let tx2 = LBColor.tx2
    static let tx3 = LBColor.tx3
    static let hair = LBColor.hair
    static let acc = LBColor.acc
    static let ok = LBColor.ok
    static let warn = LBColor.warn
    static let err = LBColor.err
}
