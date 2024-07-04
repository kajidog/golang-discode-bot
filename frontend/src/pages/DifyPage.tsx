export const DifyPage = () => {
  return (
    <div
      css={{
        flex: 1,
        height: '100%',
        background: 'black',
      }}
    >
      <iframe
        sandbox="allow-scripts allow-same-origin"
        width="100%"
        height="100%"
        src="http://localhost"
      />
    </div>
  );
};
