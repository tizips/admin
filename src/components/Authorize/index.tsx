import { useModel } from 'umi';

const Authorize = (props: APIAuthorize.Props) => {
  const { initialState } = useModel('@@initialState');

  const permission = `${initialState?.module_key}.${props.permission}`;

  return initialState?.permissions && initialState.permissions.indexOf(permission) >= 0
    ? props.children || <></>
    : props.fallback || <></>;
};

export default Authorize;
