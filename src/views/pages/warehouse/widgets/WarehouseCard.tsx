import { HiOutlineDotsVertical } from "react-icons/hi";

const WarehouseCard = () => {
    return (
        <div className="col-lg-3 col-md-6">
                    {/* Card  */}
                    <div className="card">
                        <img className="card-img-top img-responsive" src="/assets/images/blog/blog-img1.jpg" alt="Card image cap" />
                        <div className="card-body"> 
                        <h4 className="card-title">Gudang 1</h4>
                        <p className="text-dark mb-1">+62 821-2321-2221</p>
                        <p className="card-text">
                            Jl Soepraoen, No 2, Rw 03 Malang...
                        </p>
                        <p className="text-dark mb-1">Total Produk</p>
                        <h4 className="card-title mb-3">134</h4>
                        <div className="d-flex flex-row">
                            <a href="" className="btn btn-primary flex-grow-1 me-1">Detail</a>     
                            <a href="" className="btn btn-warning">
                                <HiOutlineDotsVertical />
                            </a>     
                        </div>
                        </div>
                    </div>
                    {/* Card */}
                </div>
    );
}

export default WarehouseCard;