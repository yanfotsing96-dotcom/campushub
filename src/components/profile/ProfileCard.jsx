import BadgeList from './BadgeList';

function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <h2>{user.nom}</h2>
      <p>Email : {user.email}</p>
      <p>Filière : {user.filiere}</p>
      <p>Niveau : {user.niveau}</p>
      <h3>Badges</h3>
      <BadgeList badges={user.badges} />
    </div>
  );
}

export default ProfileCard;