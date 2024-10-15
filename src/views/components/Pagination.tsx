
export const Pagination = () => {
    return (
        <nav aria-label="Page navigation example " className="d-flex justify-content-end mt-3">
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link text-dark" href="">Previous</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link text-dark" href="">1</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link text-dark" href="">2</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link text-dark" href="">3</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link text-dark" href="">Next</a>
                      </li>
                    </ul>
                  </nav>
    );
}