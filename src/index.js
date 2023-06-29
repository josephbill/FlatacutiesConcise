document.addEventListener('DOMContentLoaded', () => {
  const characters = document.getElementById('character-bar');
  const imageElement = document.getElementById('image');
  let currentId = 0;

  const fetchData = async (url, options) => {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createCharacterElement = (character) => {
    const span = document.createElement('span');
    span.innerText = character.name;
    span.addEventListener('click', () => displayCharacterData(character));
    characters.appendChild(span);
  };

  const displayCharacterData = (character) => {
    const nameElement = document.getElementById('name');
    const voteCountElement = document.getElementById('vote-count');
    const voteForm = document.getElementById('votes-form');
    const voteResetBtn = document.getElementById('reset-btn');
    const removeCharacterBtn = document.getElementById('remove-btn');

    currentId = character.id;
    nameElement.innerText = character.name;
    imageElement.src = character.image;
    voteCountElement.innerText = character.votes;

    voteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const voteInput = event.target.children[0];
      const vote = parseInt(voteInput.value);
      const votes = character.votes + vote;

      try {
        const data = await updateCharacterVotes(currentId, votes);
        voteCountElement.innerText = data.votes;
        voteInput.value = '';
      } catch (error) {
        console.error('Error updating character votes:', error);
      }
    });

    voteResetBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        const data = await updateCharacterVotes(currentId, 0);
        voteCountElement.innerText = data.votes;
      } catch (error) {
        console.error('Error resetting character votes:', error);
      }
    });

    removeCharacterBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await removeCharacter(currentId);
        characters.removeChild(span);
        nameElement.innerText = '';
        imageElement.src = '';
        voteCountElement.innerText = '';
      } catch (error) {
        console.error('Error removing character:', error);
      }
    });
  };

  const updateCharacterVotes = async (characterId, votes) => {
    return fetchData(`http://localhost:3000/characters/${characterId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: votes })
    });
  };

  const removeCharacter = async (characterId) => {
    return fetchData(`http://localhost:3000/characters/${characterId}`, {
      method: 'DELETE'
    });
  };

  const addCharacterForm = document.getElementById('character-form');
  addCharacterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nameInput = document.querySelector('input#name');
    const imageInput = document.getElementById('image-url');
    const character = {
      name: nameInput.value,
      image: imageInput.value,
      votes: 0
    };

    try {
      const data = await createCharacter(character);
      createCharacterElement(data);
      nameInput.value = '';
      imageInput.value = '';
    } catch (error) {
      console.error('Error creating character:', error);
    }
  });

  const createCharacter = async (character) => {
    return fetchData('http://localhost:3000/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
  };

  const fetchCharactersData = async () => {
    try {
      const data = await fetchData('http://localhost:3000/characters');
      data.forEach(createCharacterElement);
    } catch (error) {
      console.error('Error fetching characters data:', error);
    }
  };

  fetchCharactersData();
});
