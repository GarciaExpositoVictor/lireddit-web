import { withUrqlClient } from 'next-urql';
import React from 'react'
import { createUrlqlClient } from '../../../utils/createUrqlClient';

interface editPostProps {

}

const EditPost: React.FC<editPostProps> = ({}) => {
        return <div>hello world</div>;
}

export default withUrqlClient(createUrlqlClient)(EditPost);