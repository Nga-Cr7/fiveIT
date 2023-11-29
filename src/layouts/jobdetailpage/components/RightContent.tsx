import { JobModel } from "../../../models/JobModel"
import { useTranslation } from 'react-i18next';
export const RightContent: React.FC<{ job?: JobModel }> = (props) =>  {
    const { t } = useTranslation();
    return (
        <div className="col-lg-4">
            <div className="bg-light rounded p-5 mb-4 wow slideInUp" data-wow-delay="0.1s">
                <h4 className="mb-4">{t('jobDetail.details.right.summary')}</h4>
                <p><i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.right.createdAt')} {props.job?.createdAt}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.right.salary')} {props.job?.salary}$</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.right.location')} {props.job?.location}</p>
                <p className="m-0"><i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.right.deadline')} {props.job?.applicationDeadline}</p>
            </div>
            <div className="bg-light rounded p-5 wow slideInUp" data-wow-delay="0.1s">
                <h4 className="mb-4">FiveITViec</h4>
                <p className="m-0">{t('jobDetail.details.right.detail')}</p>
            </div>
        </div>
    );
}