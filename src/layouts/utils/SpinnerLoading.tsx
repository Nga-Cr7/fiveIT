export const SpinnerLoading = () => {
    return (
      <div
        id="spinner"
        style={{zIndex: '9999'}}
        className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
      >
        <div className="d-flex flex-column align-items-center">
          <div
            className="spinner-border text-primary mt-3"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <h2 className="mt-3 text-success">Five It Viec Always Be With You</h2>
        </div>
      </div>
    );
  };
  