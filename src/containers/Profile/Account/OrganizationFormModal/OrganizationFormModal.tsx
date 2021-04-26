import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../../widgets/FormModal';

interface IFormInputs {
    organization: string
};

interface IOrganizationFormModalModalProps {
    open?: boolean,
    handleSubmit: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void],
    handleCancel: () => void
}

const OrganizationFormModal: React.FC<IOrganizationFormModalModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: IFormInputs): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title="Organization"
            open={Boolean(props.open)}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
            sendLabel="Create"
        >
            <TextField
                defaultValue=""
                fullWidth
                required
                error={errors.organization !== undefined}
                helperText={errors.organization ? errors.organization.message : ''}
                inputProps={{
                    ...register('organization', { 
                        required: 'Required'
                    })
                }}
            />
        </FormModal>
    );
};

export default OrganizationFormModal;