"use client"

import { useEffect, useState } from "react"

interface DiffViewerProps {
  original: string
  improved: string
}

interface DiffPart {
  type: "equal" | "delete" | "insert"
  text: string
}

export function DiffViewer({ original, improved }: DiffViewerProps) {
  const [diffs, setDiffs] = useState<DiffPart[]>([])

  useEffect(() => {
    // Simple diff algorithm - in a real app, you'd use diff-match-patch
    const computeDiff = (text1: string, text2: string): DiffPart[] => {
      const words1 = text1.split(/(\s+)/)
      const words2 = text2.split(/(\s+)/)

      const result: DiffPart[] = []
      let i = 0,
        j = 0

      while (i < words1.length || j < words2.length) {
        if (i >= words1.length) {
          // Only text2 has remaining words
          result.push({ type: "insert", text: words2[j] })
          j++
        } else if (j >= words2.length) {
          // Only text1 has remaining words
          result.push({ type: "delete", text: words1[i] })
          i++
        } else if (words1[i] === words2[j]) {
          // Words match
          result.push({ type: "equal", text: words1[i] })
          i++
          j++
        } else {
          // Words don't match - simple heuristic
          const nextInText2 = words2.indexOf(words1[i], j)
          const nextInText1 = words1.indexOf(words2[j], i)

          if (nextInText2 !== -1 && (nextInText1 === -1 || nextInText2 - j < nextInText1 - i)) {
            // Insert from text2
            result.push({ type: "insert", text: words2[j] })
            j++
          } else if (nextInText1 !== -1) {
            // Delete from text1
            result.push({ type: "delete", text: words1[i] })
            i++
          } else {
            // Replace
            result.push({ type: "delete", text: words1[i] })
            result.push({ type: "insert", text: words2[j] })
            i++
            j++
          }
        }
      }

      return result
    }

    const diffResult = computeDiff(original, improved)
    setDiffs(diffResult)
  }, [original, improved])

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
          <span>Deleted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
          <span>Added</span>
        </div>
      </div>

      <div className="border-none font-mono text-sm leading-loose bg-gray-50">
        {diffs.map((diff, index) => {
          if (diff.type === "equal") {
            return <span key={index}>{diff.text}</span>
          } else if (diff.type === "delete") {
            return (
              <span key={index} className="bg-red-200 text-red-800 px-1 rounded line-through">
                {diff.text}
              </span>
            )
          } else {
            return (
              <span key={index} className="bg-green-100 text-green-800 px-1 rounded underline decoration-2 underline-offset-4 decoration-green-600/10">
                {diff.text}
              </span>
            )
          }
        })}
      </div>
    </div>
  )
}
