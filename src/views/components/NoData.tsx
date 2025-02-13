export const NoData = ({img_size, label="Belum Ada Data" }:{img_size: number, label?: string}) => {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 opacity-50">
            <img src="/images/illustrations/no_data.svg" alt="" width={img_size}/>
            <div className="text-center text-muted lead">{label}</div>
        </div>
    )
}