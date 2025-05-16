import { ReactNode } from "react"

type ComponentPropType = {
  title: string
  desc: string
  button?: ReactNode
}

export const Breadcrumb = ({ title, desc, button }: ComponentPropType) => {
  return (
    <div className="bg-blue-600 text-white rounded-xl p-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm mt-1">{desc}</p>
      </div>
      <img src="/img/produk-header.png" alt="Product" className="w-28" />
    </div>  
  )
}
