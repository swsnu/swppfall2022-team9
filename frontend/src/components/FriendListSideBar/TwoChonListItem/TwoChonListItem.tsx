import * as S from "./styles";

const TwoChonListItem: React.FC<{
  user: number;
}> = ({ user }) => {
  const size = Math.floor(Math.random() * 100) + 50;

  return (
    <>
      <S.Container spacing={true}>
        <S.Container spacing={false}>
          <S.TwoChonNode
            url={`http://placekitten.com/${size}/${size}`}
          ></S.TwoChonNode>
          <S.Username>User ID: {user}</S.Username>
        </S.Container>
      </S.Container>
    </>
  );
};

export default TwoChonListItem;
