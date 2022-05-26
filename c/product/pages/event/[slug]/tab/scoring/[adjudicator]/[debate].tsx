import { GetServerSideProps } from "next";
import Nav from "../../../../../../components/nav";

export default function ScoreInput() {
  return (
    <>
      <Nav user={undefined} />
      <h1 style={{textAlign: 'center', marginTop: '16px'}}>Scoring Debate</h1>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px 32px'}}>
      <form className="flexFormWrapper">
        <label>Speaker 1</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
        <label>Speaker 2</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
        <label>Speaker 3</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
      </form>
      <form className="flexFormWrapper">
        <label>Speaker 1</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
        <label>Speaker 2</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
        <label>Speaker 3</label>
        <div style={{ display: "flex", gap: '8px' }}>
          <select name="pets" id="pet-select" style={{flexGrow: 1}}>
            <option value="">--Please choose a speaker--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
          <input style={{width: '40px'}} />
        </div>
      </form>
      </div>
      <div style={{textAlign: 'center'}}>
      <button style={{margin: 'auto'}}>Submit Scores</button></div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await prisma
  return {props: {}}
}