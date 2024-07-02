import popout from "./popout.svg";

export default function ToggleButton({ isEdit, handleEdit, goToDashboard }) {
  return (
    <div className="popout__div">
      <button onClick={handleEdit}>
        {isEdit ? "Submit Selections" : "Edit Selections"}
      </button>
      <button className="popout__button" onClick={goToDashboard}>
        <img src={popout} alt="dashboard" />
      </button>
    </div>
  );
}
