import { ReactNode } from "react";

type ComponentPropType = {
    title: string;
    desc: string,
    button?: ReactNode,
}

export const Breadcrumb = ({title, desc, button}: ComponentPropType) => {
    return (
        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-4">
            <div className="card-body px-4 py-3">
              <div className="row align-items-center">
                <div className="col-9">
                  <h4 className="fw-semibold mb-8">{title}</h4>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        {desc}
                      </li>
                    </ol>
                  </nav>
                  {
                    button
                  }
                </div>
                <div className="col-3">
                  <div className="text-center mb-n5">
                    <img src="/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" className="img-fluid mb-n4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
}