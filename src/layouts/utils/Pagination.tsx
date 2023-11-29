import { useTranslation } from 'react-i18next';
export const Pagination: React.FC<{
    currentPage: number,
    totalPage: number,
    paginate: any
}> = (props) => {

    const { t } = useTranslation();
    const pageNumbers = [];
    if (props.currentPage === 1) {
        pageNumbers.push(props.currentPage);
        if (props.totalPage >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }
        if (props.totalPage >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);

        }
    } else if (props.currentPage > 1) {
        if (props.currentPage >= 3) {
            pageNumbers.push(props.currentPage - 2);
            pageNumbers.push(props.currentPage - 1);
        } else {
            pageNumbers.push(props.currentPage - 1);
        }
        pageNumbers.push(props.currentPage);
        if (props.totalPage >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }
        if (props.totalPage >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }

    }
    return (
        <div className="pagination-area pb-115 text-center">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="single-wrap d-flex justify-content-center">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-start">

                                    <li className="page-item" onClick={() =>{props.paginate(1)}}><button className="page-link">{t('pagination.firstPage')}</button></li>

                                    {pageNumbers.map(number => (
                                        <li key={number} onClick={() => props.paginate(number)}
                                            className={'page-item ' + (props.currentPage === number ? 'active' : '')}>
                                            <button className="page-link">
                                                {number}
                                            </button>
                                        </li>
                                    ))}


                                    <li className="page-item" onClick={() => props.paginate(props.totalPage)}><button className="page-link" >{t('pagination.lastPage')}</button></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}