const SchemeAI = ({ schemes }) => {
  return (
    <div>
      <h2>Recommended Schemes</h2>

      {schemes.map((s, index) => (
        <div key={index} className="scheme-card">
          <h3>{s.name}</h3>
          <p><b>Benefits:</b> {s.benefits}</p>
          <p><b>Eligibility:</b> {s.eligibility}</p>
        </div>
      ))}
    </div>
  );
};

export default SchemeAI;
