export default function NotFound() {
    return (
        <div 
            style={{ 
                display: "grid",
                placeContent: "center",
                minHeight: '100dvh'
            }}
        >
            <img 
                src="/public/images/illustrations/not_found_page.svg"
                alt="page not found"
                className="mb-5"
                style={{ 
                    maxHeight: "90dvh",
                    maxWidth: "70vw"
                }}
            />
            <h2 className="text-center">Halaman Tidak Ditemukan</h2>
            <a
                href="/"
                className="btn btn-primary"
                style={{ 
                    alignSelf: 'center',
                    justifySelf: "center"
                }}
            ><i className="ti ti-arrow-left"></i> Kembali</a>
        </div>
    )
}