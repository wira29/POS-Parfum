import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type TPaginationData = {
    current_page: number;
    from: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    per_page: number;
    to: number;
    total: number;
    path: string;
} | undefined;

type TUpdatePage = Dispatch<SetStateAction<number>>|((page: number) => void);

export const Pagination = ({ paginationData, updatePage }: { paginationData?: TPaginationData, updatePage: TUpdatePage}) => {
    const [paginationList, setPaginationList] = useState<
        { label: string; url: string | null; active?: boolean; disabled?: boolean, onClickFn: () => void }[]
    >([]);

    const mappingPagination = () => {
        if (!paginationData) return;

        const { current_page, last_page, prev_page_url, next_page_url, path } = paginationData;
        const pages = [];

        // Add the "Previous" page
        pages.push({
            label: "‹",
            url: prev_page_url,
            disabled: current_page === 1, // Disable if on the first page
            onClickFn: () => updatePage(current_page !== 1 ? current_page - 1 : 1)
        });

        // Determine range of pages to show
        let startPage = Math.max(current_page - 2, 1);
        let endPage = Math.min(current_page + 2, last_page);

        // Adjust range if at the beginning or end of pagination
        if (current_page <= 3) {
            endPage = Math.min(5, last_page);
        } else if (current_page > last_page - 3) {
            startPage = Math.max(last_page - 4, 1);
        }

        // Add individual pages based on the range
        for (let i = startPage; i <= endPage; i++) {
            pages.push({
                label: `${i}`,
                url: `${path}?page=${i}`,
                active: i === current_page,
                onClickFn: () => updatePage(i)
            });
        }

        // Add the "Next" page
        pages.push({
            label: "›",
            url: next_page_url,
            disabled: current_page === last_page, // Disable if on the last page
            onClickFn: () => updatePage(current_page !== last_page ? current_page + 1 : last_page)
        });

        setPaginationList(pages);
    };

    useEffect(() => {
        mappingPagination();
    }, [paginationData]);

    if (!paginationData) {
        return <p>No pagination data available.</p>;
    }

    return (
        <div className="d-flex align-items-center justify-content-between">
            <div>menampilkan {paginationData.from} sampai {paginationData.to} dari {paginationData.total} data</div>
            <nav aria-label="Page navigation">
                <ul className="pagination m-0">
                    {paginationList.map((item, index) => (
                        <li
                            key={index}
                            className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`}
                        >
                            <button type="button" className="page-link" onClick={item.onClickFn} disabled={item.disabled}>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};